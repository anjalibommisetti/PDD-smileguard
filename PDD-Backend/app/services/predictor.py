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
        
        # 1. Oral Cavity Deep Red Tissue (Gums, Lip cavity, tongue)
        red_mask = ((h < 15) | (h > 240)) & (s > 0.38) & (v > 0.20) & (v < 0.95)
        
        # 2. Tooth Enamel Pixels (Inside mouth)
        tooth_mask = (v > 0.55) & (s > 0.08) & (s < 0.32) & (v < 0.95)

        # 3. Face / Body Skin Tone
        skin_mask = (h >= 10) & (h <= 40) & (s >= 0.20) & (s <= 0.65) & (v >= 0.35)

        # 4. Window / Ceiling Room Background Light
        window_mask = (v > 0.88) & (s < 0.06)
        
        total_pixels = 224.0 * 224.0
        red_ratio = np.sum(red_mask) / total_pixels
        tooth_ratio = np.sum(tooth_mask) / total_pixels
        skin_ratio = np.sum(skin_mask) / total_pixels
        window_ratio = np.sum(window_mask) / total_pixels
        
        # Room / Webcam / Person photo check:
        if red_ratio < 0.015:
            print(f"[REJECT] Non-dental image / room photo detected: red_ratio={red_ratio:.3f} < 0.015")
            return False

        if skin_ratio > 0.30 and red_ratio < 0.022:
            print(f"[REJECT] Person/Portrait detected: skin_ratio={skin_ratio:.3f}, red_ratio={red_ratio:.3f}")
            return False

        if window_ratio > 0.15 and red_ratio < 0.02:
            print(f"[REJECT] Room window background detected: window_ratio={window_ratio:.3f}, red_ratio={red_ratio:.3f}")
            return False
            
        if (red_ratio + tooth_ratio) < 0.035:
            print(f"[REJECT] Insufficient dental features: combined_ratio={(red_ratio+tooth_ratio):.3f} < 0.035")
            return False
            
        return True
    except Exception as e:
        print(f"[WARN] Image validation exception: {e}")
        return False


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
