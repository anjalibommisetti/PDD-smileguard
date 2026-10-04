import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from app.services.predictor import predict as predictor_predict, validate_dental_image

app = FastAPI(title="Dental Image Classifier")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Class names in the SAME alphabetical order Keras reads the dataset/ folders.
# Keras sorts folder names alphabetically:
#   Calculus, Data caries, Gingivitis, Mouth Ulcer, Tooth Discoloration, hypodontia
# We map each to a user-friendly display name:
class_names = [
    "Calculus",
    "Early Childhood Caries",
    "Gingivitis",
    "Mouth Ulcer",
    "Tooth Discoloration",
    "Hypodontia",
]

precautions_map = {
    "Calculus": "Schedule a professional dental cleaning to remove tartar build-up. Maintain daily brushing and flossing.",
    "Early Childhood Caries": "Schedule a dentist appointment immediately. Avoid sugary drinks and ensure proper brushing with fluoride toothpaste.",
    "Gingivitis": "Improve oral hygiene by brushing twice daily and flossing. Use an antiseptic mouthwash. See a dentist for a checkup.",
    "Mouth Ulcer": "Avoid spicy and acidic foods. Use a soft-bristled toothbrush. If it persists for more than 2 weeks, consult a dentist.",
    "Tooth Discoloration": "Limit coffee, tea, and staining foods. Consider a professional teeth whitening consultation with a dentist.",
    "Hypodontia": "Consult an orthodontist or prosthodontist for evaluation and potential restorative options like implants or bridges."
}


@app.get("/")
async def root():
    return {"status": "online", "service": "Dental Image Classifier API"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Dental Image Classifier API"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    content = await file.read()

    # Pre-validate if the uploaded photo actually contains dental/teeth structures
    is_valid = validate_dental_image(content)
    if not is_valid:
        return JSONResponse(content={
            "status": "error",
            "is_dental_image": False,
            "error_code": "NON_DENTAL_IMAGE",
            "message": "No teeth or oral structures detected in this photo. Please upload a clear, close-up photo of your teeth.",
            "all_classes": [],
            "detected_only": [],
            "risk_score": 0,
            "risk_level": "Invalid Scan",
            "harmful_percentage": "0%",
            "precautions": ["Please retake or upload a clear, close-up photo of your teeth for an accurate diagnostic analysis."]
        })

    probs = predictor_predict(content)

    # Build per-class results
    all_classes = []
    for label, conf in zip(class_names, probs):
        detected = bool(conf >= 0.5)
        severity = "None"
        if conf >= 0.75:
            severity = "Severe"
        elif conf >= 0.60:
            severity = "Moderate"
        elif conf >= 0.50:
            severity = "Mild"
        all_classes.append({
            "label": label,
            "confidence": round(float(conf), 3),
            "detected": detected,
            "severity": severity,
        })

    detected_classes = [c for c in all_classes if c["detected"]]

    precautions_list = []
    for dc in detected_classes:
        precautions_list.append(precautions_map.get(str(dc["label"]), "Consult a dentist for professional advice."))

    # Risk scoring
    if not detected_classes:
        risk_score = 5
        risk_level = "Healthy"
    else:
        top = max(detected_classes, key=lambda x: x["confidence"])
        
        # Use a stable base score mapped to severity to prevent slight image compression 
        # differences across devices from causing fluctuating percentages.
        if top["severity"] == "Severe":
            base_score = 85
        elif top["severity"] == "Moderate":
            base_score = 65
        else:
            base_score = 55
            
        extra = (len(detected_classes) - 1) * 5
        risk_score = min(base_score + extra, 100)

        if risk_score >= 75:
            risk_level = "High"
        elif risk_score >= 50:
            risk_level = "Medium"
        elif risk_score >= 25:
            risk_level = "Low"
        else:
            risk_level = "Minimal"

    harmful_percentage = f"{risk_score}%"

    return JSONResponse(content={
        "status": "success",
        "all_classes": all_classes,
        "detected_only": detected_classes,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "harmful_percentage": harmful_percentage,
        "precautions": list(set(precautions_list))
    })
