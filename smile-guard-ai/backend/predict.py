"""
predict.py — Real CNN model loader + prediction logic
SmileGuard AI Backend
"""

import io
import os
import numpy as np
from PIL import Image

# ─── Classes (must match training order) ─────────────────────────────────────
CLASSES = [
    "Caries",
    "Calculus",
    "Gingivitis",
    "Tooth Discoloration",
    "Ulcers",
    "Hypodontia",
]

IMG_SIZE = (224, 224)
CONFIDENCE_THRESHOLD = 0.35   # min probability to count as "detected"
BLUR_THRESHOLD       = 100.0  # Laplacian variance below this = blurry image

# ─── Lazy-load model once at startup ─────────────────────────────────────────
_model = None

def get_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), "models", "oral_disease_cnn.h5")
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model file not found at {model_path}. "
                "Please train the model first using ml/train.py and copy the .h5 here."
            )
        import tensorflow as tf
        _model = tf.keras.models.load_model(model_path)
        print(f"✅ Model loaded from {model_path}")
    return _model


# ─── Image quality check ─────────────────────────────────────────────────────
def is_blurry(img: Image.Image) -> bool:
    """Returns True if image is too blurry to analyse."""
    import numpy as np
    gray = np.array(img.convert("L"), dtype=float)
    # Laplacian variance — low value = blurry
    lap_var = np.var(np.array([
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ]) @ gray @ np.array([
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ]).T if gray.shape[0] > 3 and gray.shape[1] > 3 else gray)
    return float(lap_var) < BLUR_THRESHOLD


# ─── Preprocessing ────────────────────────────────────────────────────────────
def preprocess_image(image_bytes: bytes) -> tuple:
    """
    Returns (preprocessed_array, pil_image)
    Raises ValueError if image is invalid or too blurry.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise ValueError("Invalid image file. Please upload a JPG or PNG.")

    if img.size[0] < 50 or img.size[1] < 50:
        raise ValueError("Image is too small. Please upload a clearer photo.")

    if is_blurry(img):
        raise ValueError("Image appears blurry. Please retake in better lighting.")

    img_resized = img.resize(IMG_SIZE)
    arr = np.array(img_resized) / 255.0           # normalize to [0,1]
    arr = np.expand_dims(arr, axis=0)             # shape: (1, 224, 224, 3)
    return arr, img


# ─── Prediction ───────────────────────────────────────────────────────────────
def predict(image_bytes: bytes) -> dict:
    """
    Runs the CNN model on the given image bytes.

    Returns:
    {
        predicted_class: str,
        confidence: float,          # 0-100
        all_classes: [
            { label, confidence, detected, severity }
        ]
    }
    """
    arr, _ = preprocess_image(image_bytes)
    model  = get_model()

    probs = model.predict(arr, verbose=0)[0]      # shape: (6,)

    results = []
    for i, cls in enumerate(CLASSES):
        conf     = round(float(probs[i]) * 100, 1)
        detected = float(probs[i]) >= CONFIDENCE_THRESHOLD
        severity = (
            "Severe"   if conf >= 70 else
            "Moderate" if conf >= 50 else
            "Mild"     if detected  else
            "None"
        )
        display_label = cls
        if cls == "Caries":
            display_label = "Dental Caries (Tooth Decay)"
        elif cls == "Calculus":
            display_label = "Calculus (Tartar Build-up)"
        elif cls == "Ulcers":
            display_label = "Periodontal Disease"
        elif cls == "Hypodontia":
            display_label = "Missing Tooth / Tooth Loss"

        results.append({
            "label":      display_label,
            "confidence": conf,
            "detected":   detected,
            "severity":   severity,
        })

    # Sort by confidence descending
    results.sort(key=lambda x: x["confidence"], reverse=True)

    top = results[0]
    # If top confidence is very low, flag as unclear
    if top["confidence"] < 25:
        return {
            "predicted_class": "Unclear",
            "confidence":      top["confidence"],
            "all_classes":     results,
            "warning":         "Low confidence. Please retake photo with better lighting.",
        }

    return {
        "predicted_class": top["label"] if top["detected"] else "Healthy",
        "confidence":      top["confidence"],
        "all_classes":     results,
    }
