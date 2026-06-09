import joblib
import random
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CrowdSense AI: Core Tactical Engine",
    description="Operational ML prediction and dynamic routing backend for Prayagraj 2026 Infrastructure Command Center.",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML pipeline (includes One-Hot Encoder Preprocessor + XGBoost Regressor)
try:
    model = joblib.load("crowd_model.pkl")
    print("🚀 [SUCCESS] Pure ML Pipeline ('crowd_model.pkl') loaded natively!")
except Exception as e:
    model = None
    print(f"⚠️ [WARNING] Could not load ML pipeline: {e}")
    print("👉 Please ensure you run 'python train_model.py' inside the backend directory first.")

def get_ml_prediction(location: str, temperature: float, hour: int) -> int:
    """
    Feeds features directly into the ML Pipeline.
    The Pipeline's ColumnTransformer applies One-Hot Encoding to the location string automatically.
    """
    if model:
        try:
            # Create a single-row DataFrame with explicit feature names matching the training set
            input_df = pd.DataFrame(
                [[location, temperature, hour]], 
                columns=["location", "temperature", "hour"]
            )
            prediction = model.predict(input_df)[0]
            return int(max(0, prediction))
        except Exception as err:
            print(f"Prediction execution anomaly: {err}")
            return 5000
    # Fallback baseline if model file is missing
    return 4500

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "engine": "CrowdSense AI Core",
        "pipeline_loaded": model is not None
    }

@app.get("/analyze")
def analyze_logistics(
    origin: str = Query(..., description="Source node name"),
    destination: str = Query(..., description="Target node name"),
    temperature: float = Query(..., description="Ambient temperature in Celsius"),
    hour: int = Query(..., description="Temporal window hour (0-23)")
):
    # 1. Compute direct inference using the machine learning pipeline
    base_crowd = get_ml_prediction(destination, temperature, hour)

    # 2. Operational Hazard Categorization
    if base_crowd > 12000:
        status, severity = "Critical Overload", "CRITICAL"
    elif base_crowd > 8000:
        status, severity = "Heavy Volume", "HIGH"
    elif base_crowd > 4500:
        status, severity = "Moderate Flow", "MEDIUM"
    else:
        status, severity = "Optimal Clearance", "LOW"

    # 3. Dynamic Network Routing Simulator
    base_time = random.randint(15, 25)
    if severity == "CRITICAL":
        alt_route = [origin, "Outer Perimeter Bypass", "Shastri Bridge", destination]
        primary_time = int(base_time * 2.5)
        alt_time = int(base_time * 1.2)
    elif severity == "HIGH":
        alt_route = [origin, "Pontoon Bridge 3 (Mori Marg)", destination]
        primary_time = int(base_time * 1.8)
        alt_time = int(base_time * 1.1)
    elif severity == "MEDIUM":
        alt_route = [origin, "Pontoon Bridge 1 (Triveni Marg)", destination]
        primary_time = int(base_time * 1.3)
        alt_time = int(base_time * 1.05)
    else:
        alt_route = [origin, "Direct Central Corridor", destination]
        primary_time = base_time
        alt_time = base_time

    # 4. Generate Predictive Timeline (Inferences sampled across the standard day)
    trend_data = []
    sample_hours = [0, 3, 6, 9, 12, 15, 18, 21, 23]
    
    # Ensure the user's currently selected hour is cleanly represented in the graph trends
    if hour not in sample_hours:
        sample_hours.append(hour)
        sample_hours.sort()

    for h in sample_hours:
        trend_pred = get_ml_prediction(destination, temperature, h)
        trend_data.append({
            "time": f"{h:02d}:00",
            "crowd": trend_pred
        })

    # Return the clean schema structured for frontend components
    return {
        "metrics": {
            "crowd": base_crowd,
            "status": status,
            "severity": severity,
            "location": destination
        },
        "routing": {
            "primary": f"{origin} → Main Axis → {destination}",
            "primary_time": primary_time,
            "alternate": " → ".join(alt_route),
            "alternate_time": alt_time,
            "is_diverted": primary_time > alt_time,
            "savings": max(0, primary_time - alt_time)
        },
        "trends": trend_data
    }