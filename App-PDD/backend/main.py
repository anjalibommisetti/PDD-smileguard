"""
main.py — SmileGuard AI FastAPI Backend
Entry point: uvicorn main:app --reload
"""

import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional, List

load_dotenv()

from predict  import predict as run_cnn_prediction
from risk     import compute_scan_risk, compute_assessment_risk, score_to_level
from analytics import predict_future_risk, habit_future_risk, build_trend_chart_data

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SmileGuard AI API",
    description="Real-time oral disease prediction + dynamic risk scoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ──────────────────────────────────────────────────────────────────

class AssessmentRiskRequest(BaseModel):
    habits: dict

class HistoryRecord(BaseModel):
    score: int
    level: str
    created_at: str

class FutureRiskRequest(BaseModel):
    history: List[HistoryRecord]
    current_habits: Optional[dict] = None

class TrendChartRequest(BaseModel):
    history: List[HistoryRecord]


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Health check — use this to verify the API is up."""
    return {"status": "ok", "service": "SmileGuard AI API v1.0"}


@app.post("/predict")
async def predict_scan(
    file:   UploadFile = File(...),
    habits: Optional[str] = Form(None),   # JSON string of assessment answers
):
    """
    Real AI prediction from uploaded teeth image.

    - Accepts: multipart/form-data with `file` (image) and optional `habits` (JSON)
    - Returns: predicted disease class, confidence score, risk level
    """
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/jpg"):
        raise HTTPException(
            status_code=422,
            detail="Invalid file type. Please upload a JPG or PNG image."
        )

    image_bytes = await file.read()

    # Parse habits if provided
    user_habits = None
    if habits:
        try:
            user_habits = json.loads(habits)
        except json.JSONDecodeError:
            raise HTTPException(status_code=422, detail="Invalid habits JSON format.")

    # Run CNN prediction
    try:
        prediction = run_cnn_prediction(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    # Handle unclear / low confidence
    if prediction.get("predicted_class") in ("Unclear", None):
        return JSONResponse(status_code=200, content={
            "status":  "unclear",
            "warning": prediction.get("warning", "Please retake photo in better lighting."),
            "all_classes": prediction.get("all_classes", []),
        })

    # Dynamic risk scoring
    risk = compute_scan_risk(prediction["all_classes"], user_habits)

    return {
        "status":          "success",
        "predicted_class": prediction["predicted_class"],
        "confidence":      prediction["confidence"],
        "all_classes":     prediction["all_classes"],
        "risk_score":      risk["score"],
        "risk_level":      risk["level"],
        "breakdown":       risk["breakdown"],
    }


@app.post("/assessment/risk")
def assessment_risk(req: AssessmentRiskRequest):
    """
    Calculate risk purely from assessment answers (no scan).
    Used when patient completes the questionnaire.
    """
    result = compute_assessment_risk(req.habits)
    return result


@app.post("/analytics/future-risk")
def future_risk(req: FutureRiskRequest):
    """
    Predict future risk based on past scan history + habits.
    Accepts list of {score, level, created_at} records.
    """
    history_dicts = [r.dict() for r in req.history]
    trend = predict_future_risk(history_dicts)

    habit_proj = None
    if req.current_habits and trend.get("predicted_score_30d") is not None:
        habit_proj = habit_future_risk(req.current_habits, req.history[-1].score)

    return {
        "trend_analysis":    trend,
        "habit_projection":  habit_proj,
    }


@app.post("/analytics/chart-data")
def chart_data(req: TrendChartRequest):
    """
    Returns formatted chart data for the frontend trend graph.
    """
    history_dicts = [r.dict() for r in req.history]
    data = build_trend_chart_data(history_dicts)
    return {"chart_data": data}


# ─── Run locally ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
