# app/services/predictor.py
import os
import io
import numpy as np
from PIL import Image, ImageOps
import tensorflow as tf

MODEL_PATH = "ml/dental_classifier.h5"
IMG_SIZE = (224, 224)

# Global model cache
_model = None

def load_model():
    """Load the trained CNN model. Raises if model file is missing."""
    global _model
    if _model is not None:
        return _model
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    _model = tf.keras.models.load_model(MODEL_PATH)
    print(f"[INFO] Loaded CNN model from {MODEL_PATH}")
    print(f"[INFO] Model output shape: {_model.output_shape}")
    return _model

def validate_dental_image(image_bytes: bytes) -> bool:
    """Validates if the uploaded image contains dental/teeth structures using color & texture analysis."""
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = ImageOps.exif_transpose(img)
        img = img.resize((224, 224))
        
        # Convert to HSV
        img_hsv = img.convert("HSV")
        hsv_np = np.array(img_hsv, dtype=np.float32)
        
        h = hsv_np[:, :, 0] # 0..255
        s = hsv_np[:, :, 1] / 255.0 # 0.0..1.0
        v = hsv_np[:, :, 2] / 255.0 # 0.0..1.0
        
        # 1. Enamel/Tooth pixels: High brightness (v > 0.45), low saturation (s < 0.40)
        tooth_mask = (v > 0.45) & (s < 0.40)
        
        # 2. Oral/Gum pixels: Reddish hues, moderate brightness & saturation
        red_mask = ((h < 25) | (h > 230)) & (s > 0.20) & (v > 0.25)
        
        dental_pixels = np.sum(tooth_mask | red_mask)
        total_pixels = 224 * 224
        ratio = dental_pixels / total_pixels
        
        return bool(ratio >= 0.15)
    except Exception as e:
        print(f"[WARN] Image validation error: {e}")
        return True


def predict(image_bytes: bytes) -> np.ndarray:
    """Predict the class probabilities of a dental image using the CNN model.
    
    Returns:
        numpy array of shape (6,) with softmax probabilities for each class.
        Class order (alphabetical from dataset folders):
          [Calculus, Data caries, Gingivitis, Mouth Ulcer, Tooth Discoloration, hypodontia]
    """
    model = load_model()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Apply EXIF transpose to ensure correct orientation across different devices
    img = ImageOps.exif_transpose(img)
    
    # Use bilinear interpolation to match training data loading
    resample_method = Image.Resampling.BILINEAR if hasattr(Image, "Resampling") else Image.BILINEAR
    img = img.resize(IMG_SIZE, resample_method)
    
    arr = np.array(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)   # shape: (1, 224, 224, 3)
    # Note: do NOT divide by 255 here — the model has a Rescaling layer built in
    probs = model.predict(arr)[0]       # shape: (num_classes,)
    return probs
