"""
risk.py — Dynamic risk scoring engine
SmileGuard AI Backend

Combines:
  1. CNN scan prediction confidence × disease severity weight
  2. User habit penalties from assessment answers
"""

# ─── Disease severity weights (higher = more dangerous) ──────────────────────
DISEASE_WEIGHTS: dict[str, float] = {
    "Dental Caries (Tooth Decay)": 0.30,
    "Gingivitis":                  0.25,
    "Calculus (Tartar Build-up)":  0.20,
    "Periodontal Disease":         0.15,
    "Tooth Discoloration":         0.07,
    "Missing Tooth / Tooth Loss":  0.03,
}

# ─── Risk level thresholds ────────────────────────────────────────────────────
THRESHOLDS = {"High": 60, "Medium": 30}   # < 30 = Low


def score_to_level(score: int) -> str:
    if score >= THRESHOLDS["High"]:   return "High"
    if score >= THRESHOLDS["Medium"]: return "Medium"
    return "Low"


# ─── Habit penalty map (from assessment answers q-codes) ─────────────────────
def _habit_penalty(habits: dict) -> int:
    penalty = 0

    # Brushing frequency
    brush_penalties = {"Irregular": 15, "Once": 8, "Twice": 0, "More than twice": 0}
    penalty += brush_penalties.get(habits.get("q5", ""), 0)

    # Fluoride toothpaste
    if habits.get("q6") == "No":            penalty += 5
    if habits.get("q6") == "Don't know":    penalty += 2

    # Supplemental hygiene tools
    q7 = habits.get("q7", [])
    if "None" in q7:                        penalty += 8

    # Tongue cleaning
    tongue = {"Never": 8, "Occasionally": 4, "Daily": 0}
    penalty += tongue.get(habits.get("q8", ""), 0)

    # Sugar consumption
    sugar = {"Rarely": 0, "Once a day": 10, "2–3 times a day": 16, "More than 3 times a day": 22}
    penalty += sugar.get(habits.get("q9", ""), 0)

    if habits.get("q10") == "Yes": penalty += 5   # sweet between meals
    if habits.get("q11") == "Yes": penalty += 8   # sweet before bed

    # Dental history
    decay = {"Yes": 8, "Not sure": 3, "No": 0}
    penalty += decay.get(habits.get("q12", ""), 0)
    if habits.get("q13") == "Yes": penalty += 8   # gum problems

    # Dentist visit frequency
    dentist = {
        "Never":            15,
        "Only when in pain": 10,
        "Once a year":       3,
        "Every 6 months":    0,
    }
    penalty += dentist.get(habits.get("q15", ""), 0)

    # Current symptoms (high weight)
    if habits.get("q16") == "Yes": penalty += 10  # gum bleeding
    if habits.get("q17") == "Yes": penalty += 10  # tooth pain
    if habits.get("q18") == "Yes": penalty += 12  # loose teeth
    if habits.get("q19") == "Yes": penalty += 6   # bad breath
    if habits.get("q20") == "Yes": penalty += 15  # swelling/pus

    # Medical conditions
    q21 = habits.get("q21", [])
    if "Diabetes" in q21:      penalty += 8
    if "Heart disease" in q21: penalty += 5
    if habits.get("q22") == "Yes": penalty += 4   # long-term meds

    # Lifestyle
    if habits.get("q23") == "Yes": penalty += 12  # tobacco
    if habits.get("q24") == "Yes": penalty += 5   # alcohol

    return penalty


# ─── Main scoring function ────────────────────────────────────────────────────
def compute_scan_risk(predictions: list[dict], user_habits: dict | None = None) -> dict:
    """
    predictions: list of {label, confidence, detected} from predict.py
    user_habits: dict of assessment answers (optional — used for combined scoring)

    Returns:
    {
        score:    int (0-100),
        level:    "Low" | "Medium" | "High",
        breakdown: {
            scan_score:    int,
            habit_penalty: int,
            total:         int,
        }
    }
    """
    # 1. CNN scan contribution (weighted by disease importance + confidence)
    scan_raw = 0.0
    for p in predictions:
        if p.get("detected"):
            weight = DISEASE_WEIGHTS.get(p["label"], 0.05)
            scan_raw += (p["confidence"] / 100.0) * weight * 100.0

    scan_score = min(int(round(scan_raw)), 70)   # cap scan at 70

    # 2. Habit penalty
    habit_penalty = _habit_penalty(user_habits) if user_habits else 0

    # 3. Combined total
    total = min(100, scan_score + habit_penalty)
    level = score_to_level(total)

    # 4. Per-disease breakdown for UI
    disease_breakdown = []
    for p in predictions:
        w  = DISEASE_WEIGHTS.get(p["label"], 0.05)
        ds = round((p["confidence"] / 100.0) * w * 100.0, 1) if p.get("detected") else 0
        disease_breakdown.append({
            "label":        p["label"],
            "detected":     p.get("detected", False),
            "confidence":   p.get("confidence", 0),
            "risk_contribution": ds,
        })

    return {
        "score":   total,
        "level":   level,
        "breakdown": {
            "scan_score":          scan_score,
            "habit_penalty":       habit_penalty,
            "total":               total,
            "disease_breakdown":   disease_breakdown,
        },
    }


# ─── Assessment-only risk (no scan) ─────────────────────────────────────────
def compute_assessment_risk(habits: dict) -> dict:
    """Used when no scan is available — pure habit-based scoring."""
    MAX_RAW = 198
    raw = _habit_penalty(habits)
    score = min(100, round((raw / MAX_RAW) * 100))
    level = score_to_level(score)

    breakdown = [
        {
            "label": "Hygiene",
            "value": min(100, round(
                (_habit_penalty({k: habits[k] for k in ["q5","q6","q7","q8"] if k in habits}) / 37) * 100
            )),
            "color": "#86F1D4",
        },
        {
            "label": "Diet",
            "value": min(100, round(
                (_habit_penalty({k: habits[k] for k in ["q9","q10","q11"] if k in habits}) / 35) * 100
            )),
            "color": "#FFCDB2",
        },
        {
            "label": "Symptoms",
            "value": min(100, round(
                (_habit_penalty({k: habits[k] for k in ["q16","q17","q18","q19","q20"] if k in habits}) / 53) * 100
            )),
            "color": "#EF4444",
        },
        {
            "label": "Lifestyle",
            "value": min(100, round(
                (_habit_penalty({k: habits[k] for k in ["q23","q24"] if k in habits}) / 17) * 100
            )),
            "color": "#7C3AED",
        },
    ]

    insight = (
        "Your responses indicate significant oral health risk factors. Immediate dental consultation is strongly advised."
        if level == "High" else
        "Moderate risk detected. Improving daily habits and scheduling a dental visit can help prevent progression."
        if level == "Medium" else
        "Your oral health indicators are looking good. Keep up with regular hygiene and periodic check-ups."
    )

    recommendations = (
        ["Visit a dentist within the next 2 weeks",
         "Brush twice daily with fluoride toothpaste",
         "Stop tobacco and limit alcohol",
         "Start flossing daily"]
        if level == "High" else
        ["Schedule a dental visit within 3 months",
         "Reduce sugary food consumption",
         "Brush twice daily and floss regularly",
         "Consider using mouthwash"]
        if level == "Medium" else
        ["Maintain your current hygiene routine",
         "Continue 6-monthly dental check-ups",
         "Stay hydrated and limit sugary drinks"]
    )

    return {
        "score":           score,
        "level":           level,
        "breakdown":       breakdown,
        "insight":         insight,
        "recommendations": recommendations,
    }
