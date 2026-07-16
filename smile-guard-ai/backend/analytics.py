"""
analytics.py — Predictive future risk & trend analysis
SmileGuard AI Backend
"""

from datetime import datetime
from typing import Optional


# ─── Trend & Future Risk ──────────────────────────────────────────────────────

def predict_future_risk(history: list[dict]) -> dict:
    """
    Accepts a list of completed assessment records:
      [{ "score": int, "created_at": "ISO-date-string" }, ...]
      sorted oldest → newest.

    Returns:
    {
        trend:                "improving" | "worsening" | "stable" | "insufficient_data",
        avg_change_per_scan:  float,
        predicted_score_30d:  int | None,
        predicted_score_90d:  int | None,
        status_message:       str,
        data_points:          int,
    }
    """
    # Filter only valid completed records
    valid = [h for h in history if isinstance(h.get("score"), (int, float)) and h["score"] > 0]
    valid.sort(key=lambda x: x.get("created_at", ""))

    if len(valid) < 2:
        return {
            "trend":               "insufficient_data",
            "avg_change_per_scan":  0,
            "predicted_score_30d": None,
            "predicted_score_90d": None,
            "status_message":      "Complete at least 2 assessments to see your risk trend.",
            "data_points":         len(valid),
        }

    scores = [int(h["score"]) for h in valid]

    # ── Simple linear regression ──────────────────────────────────────────────
    n  = len(scores)
    xs = list(range(n))
    x_mean = sum(xs) / n
    y_mean = sum(scores) / n

    numerator   = sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, scores))
    denominator = sum((x - x_mean) ** 2 for x in xs)
    slope = numerator / denominator if denominator != 0 else 0

    # Predict 30-day and 90-day assuming 1 scan ≈ 2 weeks avg cadence
    # so 30d ≈ 2 more scans, 90d ≈ 6 more scans
    pred_30d = int(min(100, max(0, round(scores[-1] + slope * 2))))
    pred_90d = int(min(100, max(0, round(scores[-1] + slope * 6))))

    avg_change = round(slope, 1)
    trend = (
        "improving"  if slope < -2 else
        "worsening"  if slope >  2 else
        "stable"
    )

    status = {
        "improving": "🟢 Your risk is declining — great progress! Keep up your habits.",
        "worsening": "🔴 Risk is increasing. Schedule a dental visit soon.",
        "stable":    "🟡 Risk is stable. Small improvements in habits can make a big difference.",
    }[trend]

    return {
        "trend":               trend,
        "avg_change_per_scan": avg_change,
        "predicted_score_30d": pred_30d,
        "predicted_score_90d": pred_90d,
        "status_message":      status,
        "data_points":         n,
    }


# ─── Habit-based future risk ──────────────────────────────────────────────────

def habit_future_risk(habits: dict, current_score: int) -> dict:
    """
    Estimates what score would look like if the user adopts recommended habits.

    Returns:
    {
        current_score:       int,
        optimistic_score:    int,   # if user fixes top 3 habit issues
        pessimistic_score:   int,   # if habits worsen
        key_risk_drivers:    list[str],
    }
    """
    drivers = []
    potential_savings = 0

    if habits.get("q5") in ["Once", "Irregular"]:
        drivers.append("Irregular brushing (+8–15 pts)")
        potential_savings += 12

    if habits.get("q9") in ["2–3 times a day", "More than 3 times a day"]:
        drivers.append("Frequent sugar intake (+16–22 pts)")
        potential_savings += 18

    if habits.get("q23") == "Yes":
        drivers.append("Tobacco use (+12 pts)")
        potential_savings += 12

    q7 = habits.get("q7", [])
    if "None" in q7:
        drivers.append("No flossing or mouthwash (+8 pts)")
        potential_savings += 8

    if habits.get("q15") in ["Never", "Only when in pain"]:
        drivers.append("Infrequent dental visits (+10–15 pts)")
        potential_savings += 12

    optimistic  = max(0, current_score - potential_savings)
    pessimistic = min(100, current_score + 15)

    return {
        "current_score":    current_score,
        "optimistic_score": optimistic,
        "pessimistic_score": pessimistic,
        "key_risk_drivers": drivers[:4],   # top 4 drivers
        "potential_improvement": potential_savings,
    }


# ─── Trend history for chart ──────────────────────────────────────────────────

def build_trend_chart_data(history: list[dict]) -> list[dict]:
    """
    Returns normalised chart data points for the frontend trend graph.

    Input:  [{ score, created_at, level }]
    Output: [{ date: "05 May", score: int, level: str }]
    """
    result = []
    for h in history:
        try:
            dt = datetime.fromisoformat(h["created_at"].replace("Z", "+00:00"))
            label = dt.strftime("%d %b")
        except Exception:
            label = "?"
        result.append({
            "date":  label,
            "score": int(h.get("score", 0)),
            "level": h.get("level", "Low"),
        })
    return result
