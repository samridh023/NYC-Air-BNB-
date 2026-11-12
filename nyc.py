from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "Model_Pipeline.pkl"

app = FastAPI(title="StayScope NYC Airbnb Room Type Predictor", version="1.0.0")

# The frontend may be opened locally (file://) or served by a local static server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

COLUMNS = [
    "latitude", "longitude", "price", "minimum_nights",
    "number_of_reviews", "reviews_per_month",
    "calculated_host_listings_count", "availability_365",
    "neighbourhood_group", "neighbourhood",
]

if not MODEL_PATH.is_file():
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}. Keep Model_Pipeline.pkl beside nyc.py."
    )

# Resolve the model relative to this Python file, not the terminal's current folder.
model = joblib.load(MODEL_PATH)


class Features(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    price: float = Field(..., gt=0)
    minimum_nights: int = Field(..., ge=1, le=365)
    number_of_reviews: int = Field(..., ge=0)
    reviews_per_month: float = Field(..., ge=0)
    calculated_host_listings_count: int = Field(..., ge=0)
    availability_365: int = Field(..., ge=0, le=365)
    neighbourhood_group: str = Field(..., min_length=1)
    neighbourhood: str = Field(..., min_length=1)


@app.get("/")
def greet():
    return {"status": "ok", "message": "StayScope API is running"}


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict")
def predict(features: Features):
    try:
        row = pd.DataFrame([features.model_dump()], columns=COLUMNS)
        prediction = model.predict(row)
        probability = model.predict_proba(row)
        return {
            "Predicted_room_type": str(prediction[0]),
            "Probability": probability.tolist()[0],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
