from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import numpy as np
import joblib
import shap




# ==========================
# Chargement du modèle
# ==========================

model= joblib.load("model.pkl")
explainer = shap.TreeExplainer(model)
scaler= joblib.load("scaler.pkl")
features = joblib.load("features.pkl")
risk_labels = joblib.load("risk_labels.pkl")


# ==========================
# API
# ==========================
app= FastAPI(
    title = "Early Detection API ",
    description= "Détection précoce des difficultés scolaires",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Schéma Input
# ==========================

class StudentInput(BaseModel):
    values:list 

class BatchInput(BaseModel):
    student:list

class ExplainInput(BaseModel):
    student: list
# ==========================
# Home
# ==========================

@app.get("/")
def home():
    return {
        "message" : "Early Detection Student API"
    }
# ==========================
# Informations du modèle
# ==========================

@app.get("/model-info")
def model_info():
    return {
        "features_count": len(features),
        "risk_labels" :risk_labels
    }

# ==========================
# Prédiction
# ==========================
@app.post("/predict")
def predict(student: StudentInput):
    data = pd.DataFrame(
        [student.values],
        columns= features
    )

    data_scaled = scaler.transform(data)
    prediction = model.predict(data_scaled)[0]
    probabilities = model.predict_proba(data_scaled)[0]

    return {
        "risk_class" : int(prediction),
        "risk_label": risk_labels[int(prediction)],
        "probabilities": probabilities.tolist()
    }

# ce endpoint nous aide a faire l'explication de notre Model
@app.post("/explain-student")
def explain_student(data: ExplainInput):

    student = data.student

    print("Nombre features reçues :", len(student))
    print(student[:5])

    df = pd.DataFrame(
        [student],
        columns=features
    )

    df_scaled = scaler.transform(df)

    shap_values = explainer.shap_values(df_scaled)

    importance = []

    print(type(shap_values))
    print(np.array(shap_values).shape)

    for i, feature in enumerate(features):

        importance.append({
            "feature": feature,
            "value": float(shap_values[0][i][2])
        })
        print(shap_values[0][0])

    importance = sorted(
        importance,
        key=lambda x: abs(x["value"]),
        reverse=True
    )

    return {
        "top_features": importance[:10]
    }


@app.post("/predict-batch")

def predict_batch(batch: BatchInput ):
    df= pd.DataFrame(
        batch.student,
        columns= features
    )

    df_scaled = scaler.transform(df)
    print("DataFrame shape :",df.shape)
    print(df.head())
    prediction= model.predict(df_scaled)
    probabilities = model.predict_proba(df_scaled)

    results= []

    for i in range(len(df)):
        max_prob= float(np.max(probabilities[i]))
        results.append({
            "student_id": i,
            "risk_class": int(prediction[i]),
            "risk_label": risk_labels[int(prediction[i])],
            "probability": round(max_prob * 100, 2)
        })
    return results
# Endpoint Dashboard Summary
# C'est lui qui alimentera les KPI du Dashboard.
@app.post("/dashboard-summary")
def dashboard_summary(batch: BatchInput):
    df = pd.DataFrame(
        batch.student,
        columns= features
    )

    df_scaled = scaler.transform(df)
    prediction = model.predict(df_scaled)
    total_students = len(df)

    low_risk= int(sum(prediction==0))
    medium_risk= int(sum(prediction==1))
    high_risk= int(sum(prediction==2))

    return {
        "total_students": total_students,
        "risk_distribution" : {
            "low": low_risk,
            "medium": medium_risk,
            "high": high_risk
        },

        "attendance" : {
            "avg_absences": round(df["total_absences"].mean(),2),
            "avg_retards": round(df["total_retards"].mean(),2)   
        },

        "academic" : {
            "avg_general": round(df["moyenne_generale_annuelle"].mean(),2)
        }
    }




