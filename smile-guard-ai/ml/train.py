"""
train.py — CNN Model Training for SmileGuard AI
Dataset: Kaggle Oral Diseases (6 classes)
https://www.kaggle.com/datasets/salmansajid05/oral-diseases

Usage:
  1. Download the dataset from Kaggle
  2. Place images in:
       ml/dataset/train/<class_name>/
       ml/dataset/test/<class_name>/
  3. Run: python train.py

OR run this entire notebook in Google Colab for free GPU access.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt

# ─── Config ──────────────────────────────────────────────────────────────────
IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
EPOCHS      = 30
NUM_CLASSES = 6
CLASSES     = ["Caries", "Calculus", "Gingivitis", "Tooth Discoloration", "Ulcers", "Hypodontia"]

TRAIN_DIR   = "dataset/train"
TEST_DIR    = "dataset/test"
MODEL_OUT   = "models/oral_disease_cnn.h5"

print(f"TensorFlow version: {tf.__version__}")
print(f"GPU available: {len(tf.config.list_physical_devices('GPU')) > 0}")


# ─── Data Augmentation ────────────────────────────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode="nearest",
    validation_split=0.2,
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True,
)

val_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False,
)

test_gen = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False,
)

print(f"\n✅ Train samples:      {train_gen.samples}")
print(f"✅ Validation samples: {val_gen.samples}")
print(f"✅ Test samples:       {test_gen.samples}")
print(f"✅ Classes found:      {train_gen.class_indices}")


# ─── Model Architecture (MobileNetV2 Transfer Learning) ──────────────────────
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(*IMG_SIZE, 3),
    include_top=False,
    weights="imagenet",
)
base_model.trainable = False   # Freeze base initially

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dropout(0.4),
    layers.Dense(256, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(128, activation="relu"),
    layers.Dense(NUM_CLASSES, activation="softmax"),
], name="SmileGuard_CNN")

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()


# ─── Callbacks ────────────────────────────────────────────────────────────────
cb_list = [
    callbacks.EarlyStopping(
        monitor="val_accuracy", patience=6,
        restore_best_weights=True, verbose=1
    ),
    callbacks.ReduceLROnPlateau(
        monitor="val_loss", factor=0.5,
        patience=3, min_lr=1e-7, verbose=1
    ),
    callbacks.ModelCheckpoint(
        MODEL_OUT, monitor="val_accuracy",
        save_best_only=True, verbose=1
    ),
]

# ─── Phase 1: Train head only (frozen base) ───────────────────────────────────
print("\n🔵 Phase 1: Training head layers (base frozen)...")
history1 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=15,
    callbacks=cb_list,
)


# ─── Phase 2: Fine-tune top layers of base ────────────────────────────────────
print("\n🟣 Phase 2: Fine-tuning top 30 layers of MobileNetV2...")
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),   # lower LR for fine-tuning
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

history2 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    initial_epoch=len(history1.history["accuracy"]),
    callbacks=cb_list,
)


# ─── Evaluation ───────────────────────────────────────────────────────────────
print("\n📊 Evaluating on test set...")
test_loss, test_acc = model.evaluate(test_gen, verbose=1)
print(f"\n✅ Test accuracy:  {test_acc:.4f} ({test_acc*100:.1f}%)")
print(f"✅ Test loss:      {test_loss:.4f}")

# Classification report
y_pred  = np.argmax(model.predict(test_gen, verbose=0), axis=1)
y_true  = test_gen.classes
print("\n📋 Classification Report:")
print(classification_report(y_true, y_pred, target_names=CLASSES))

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
print("\n📋 Confusion Matrix:")
print(cm)


# ─── Save & plot ─────────────────────────────────────────────────────────────
model.save(MODEL_OUT)
print(f"\n✅ Model saved to {MODEL_OUT}")

# Training curves
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
all_acc  = history1.history["accuracy"]  + history2.history["accuracy"]
all_vacc = history1.history["val_accuracy"] + history2.history["val_accuracy"]
all_loss = history1.history["loss"]  + history2.history["loss"]
all_vloss= history1.history["val_loss"] + history2.history["val_loss"]

ax1.plot(all_acc,  label="Train Accuracy")
ax1.plot(all_vacc, label="Val Accuracy")
ax1.set_title("Accuracy")
ax1.legend()

ax2.plot(all_loss,  label="Train Loss")
ax2.plot(all_vloss, label="Val Loss")
ax2.set_title("Loss")
ax2.legend()

plt.tight_layout()
plt.savefig("models/training_curves.png")
print("✅ Training curves saved to models/training_curves.png")
