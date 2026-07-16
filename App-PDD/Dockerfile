FROM python:3.11-slim

# System libraries required by TensorFlow and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python dependencies first (caches layers)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and the trained model (if present in repo)
COPY . ./

# Render provides $PORT; default to 10000 for local testing
ENV PORT=10000
EXPOSE $PORT

# Start the FastAPI app with uvicorn
CMD ["uvicorn", "inference_api:app", "--host", "0.0.0.0", "--port", "${PORT}"]
