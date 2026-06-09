# 🌊 CrowdSense AI 
**Strategic Infrastructure & Operations Command Center for Mahakumbh 2026**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-14354C?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)

---

## 🚀 Overview
**CrowdSense AI** is a predictive logistics and dynamic routing engine designed to manage massive-scale human convergence. This system shifts infrastructure management from reactive defense to proactive distribution by predicting crowd density and dynamically rerouting traffic to prevent bottlenecks before they occur.

## ⚡ The Solution
Unlike traditional crowd management, CrowdSense AI utilizes a **Pure Machine Learning Pipeline**. 
* **Native Geospatial Intelligence:** Using **One-Hot Encoding**, our XGBoost model natively learns the unique crowd characteristics of different Prayagraj nodes (Sangam, Railway Junction, Temples, etc.) rather than relying on hardcoded multipliers.
* **Dynamic Routing:** Real-time calculation of congestion penalties to generate optimized detour corridors.
* **Tactical Dashboard:** A high-contrast "Night Operations" UI providing real-time telemetry and 24-hour predictive flux analytics.

## 🧠 System Architecture
1.  **ML Pipeline (Predictive Engine):** A Scikit-Learn/XGBoost pipeline that ingests `temperature`, `hour`, and `location` to perform non-linear density forecasting.
2.  **Tactical Backend (FastAPI):** Serves ML inferences, computes severity profiles (Optimal, Moderate, High, Critical), and triggers the dynamic routing engine.
3.  **Command Dashboard (React):** A responsive telemetry interface featuring real-time map plotting via `React-Leaflet` and predictive trend charting via `Recharts`.

---

## ⚙️ Local Development Setup

Open two separate terminal windows in your project root:

### 1. Start the AI Backend (Terminal 1)
```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```
### 2. Frontend Command Center (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```