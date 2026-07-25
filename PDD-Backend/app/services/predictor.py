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
    """Validates if the uploaded image contains genuine dental/teeth/oral structures."""
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
        
        # 1. Oral/Gum/Lip Tissue (Red/Pinkish hues)
        red_mask = ((h < 20) | (h > 235)) & (s > 0.22) & (v > 0.20) & (v < 0.95)
        
        # 2. Tooth Enamel Pixels
        tooth_mask = (v > 0.50) & (s < 0.35) & (v < 0.98)
        
        total_pixels = 224.0 * 224.0
        red_ratio = np.sum(red_mask) / total_pixels
        tooth_ratio = np.sum(tooth_mask) / total_pixels
        
        # A genuine dental close-up scan ALWAYS contains red/pink oral tissue (gums/lips)
        # In a portrait/desk/room/background photo, red oral tissue is < 1.5%.
        if red_ratio < 0.015:
            print(f"[REJECT] Non-dental image detected: red_ratio={red_ratio:.3f} < 0.015")
            return False
            
        if (red_ratio + tooth_ratio) < 0.12:
            print(f"[REJECT] Insufficient dental features: combined_ratio={(red_ratio+tooth_ratio):.3f} < 0.12")
            return False
            
        return True
    except Exception as e:
        print(f"[WARN] Image validation exception: {e}")
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
