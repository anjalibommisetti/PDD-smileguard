# SmileGuard AI — Backend Setup Guide

## Prerequisites

- Python 3.10+
- pip
- Trained model file (`oral_disease_cnn.h5`)

---

## Step 1 — Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## Step 2 — Add the Trained Model

Copy the trained model from `ml/models/oral_disease_cnn.h5` into `backend/models/`:

```bash
cp ../ml/models/oral_disease_cnn.h5 models/
```

> If you haven't trained the model yet, run `cd ../ml && python train.py` first.
> Or use **Google Colab** (recommended for free GPU):
>
> 1. Upload `ml/train.py` to Colab
> 2. Upload your dataset
> 3. Run the script
> 4. Download the saved `.h5` file

---

## Step 3 — Environment Variables

```bash
cp .env.example .env
# Fill in your Supabase credentials
```

---

## Step 4 — Run Locally

```bash
uvicorn main:app --reload --port 8000
```

API docs will be available at: http://localhost:8000/docs

---

## Step 5 — Test the API

```bash
# Health check
curl http://localhost:8000/health

# Predict (replace with a real teeth image)
curl -X POST http://localhost:8000/predict \
  -F "file=@/path/to/teeth.jpg"

# With habits
curl -X POST http://localhost:8000/predict \
  -F "file=@/path/to/teeth.jpg" \
  -F 'habits={"q5":"Irregular","q9":"2–3 times a day","q23":"No"}'
```

---

## Step 6 — Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Add environment variables in Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
6. Upload `oral_disease_cnn.h5` to Render's **Disk** (Persistent Storage) or host on HuggingFace Hub

---

## API Endpoints

| Method | Endpoint                 | Description                           |
| ------ | ------------------------ | ------------------------------------- |
| GET    | `/health`                | Health check                          |
| POST   | `/predict`               | Real CNN prediction from image        |
| POST   | `/assessment/risk`       | Risk score from questionnaire answers |
| POST   | `/analytics/future-risk` | Predict future risk from history      |
| POST   | `/analytics/chart-data`  | Format data for trend chart           |

---

## Dataset

- **Source:** [Kaggle Oral Diseases Dataset](https://www.kaggle.com/datasets/salmansajid05/oral-diseases)
- **Classes:** Caries, Calculus, Gingivitis, Tooth Discoloration, Ulcers, Hypodontia
- **Training script:** `ml/train.py`
