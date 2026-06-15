from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import numpy as np
import joblib
import shap

# pour la decision pédagogique

semantic_groups = {

    "Français":[
        "français_orale",
        "français_lecture",
        "français_ecriture",
        "français_vocab",
        "français_grammaire_orth",
        "français_T1",
        "français_T2"
    ],

    "Mathématiques":[
        "math_T1",
        "math_T2",
        "math_annuel",
        "math_nombres_calcul",
        "math_grandeurs_mesures",
        "math_espace_geometrie"
    ],

    "Arabe":[
        "arabe_T1",
        "arabe_T2",
        "arabe_annuel"
    ],

    "Anglais":[
        "anglais_T1",
        "anglais_T2"
    ],

    "Physique-Chimie":[
        "physique_chimie"
    ],

    "SVT":[
        "svt"
    ],

    "Technologie":[
        "techno"
    ],

    "Assiduité":[
        "absences",
        "retards",
        "total_absences",
        "total_retards"
    ],

    "Performance Générale":[
        "moyenne_generale"
    ]
}




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

    student_row = df.iloc[0]

    # pour filter les matieres inexistantes chez les niveaux pour l'explication SHAP

    exist_mapping = {

    "français_orale":
        "français_orale_exist",

    "français_lecture":
        "français_lecture_exist",

    "français_ecriture":
        "français_ecriture_exist",

    "français_vocab":
        "français_vocab_exist",

    "français_grammaire_orth":
        "français_grammaire_orth_exist",

    "math_nombres_calcul":
        "math_nombres_calcul_exist",

    "math_grandeurs_mesures":
        "math_grandeurs_mesures_exist",

    "math_espace_geometrie":
        "math_espace_geometrie_exist",

    "emc":
        "emc_exist",

    "espagnol":
        "espagnol_exist",

    "physique_chimie":
        "physique_chimie_exist",

    "svt":
        "svt_exist",

    "techno":
        "techno_exist"
}



    df_scaled = scaler.transform(df)

    shap_values = explainer.shap_values(df_scaled)

    importance = []

    print(type(shap_values))
    print(np.array(shap_values).shape)

    for i, feature in enumerate(features):

        skip_feature = False

        for subject, exist_col in exist_mapping.items():

            if feature.startswith(subject):

                if student_row[exist_col] == 0:

                    skip_feature = True

                break

        if skip_feature: continue
        importance.append({
            "feature": feature,
            "value": float(
                shap_values[0][i][2]
            )
        })

    importance = sorted(
        importance,
        key=lambda x: abs(x["value"]),
        reverse=True
    )
    category_scores = {}
    for item in importance:

        feature_name = item["feature"]

        shap_value = item["value"]

        for category, feature_list in semantic_groups.items():

            for prefix in feature_list:

                if prefix in feature_name:

                    if category not in category_scores:

                        category_scores[category] = 0

                    category_scores[category] += shap_value

                    break
                
    
    semantic_importance = []

    for category, score in category_scores.items():

        semantic_importance.append({

            "category": category,

            "value": round(score, 3)

        })
    
    semantic_importance = sorted(

    semantic_importance,

    key=lambda x:
        abs(x["value"]),

    reverse=True
    )

# les recommandations pédagogiques

    recommendations = []

    for item in semantic_importance[:3]:

        category = item["category"]

        if item["value"] <= 0:
           continue

        if category == "Français":

            recommendations.append(
                "Renforcement des compétences en français (lecture, écriture et expression orale)."
            )

        elif category == "Mathématiques":

            recommendations.append(
                "Mettre en place des séances de soutien en mathématiques."
            )

        elif category == "Arabe":

            recommendations.append(
                "Prévoir des activités de remédiation en langue arabe."
            )

        elif category == "Anglais":

            recommendations.append(
                "Renforcer les compétences linguistiques en anglais."
            )

        elif category == "Physique-Chimie":

            recommendations.append(
                "Accompagnement ciblé en physique-chimie."
            )

        elif category == "SVT":

            recommendations.append(
                "Renforcement des acquis en SVT."
            )

        elif category == "Technologie":

            recommendations.append(
                "Travail complémentaire en technologie."
            )

        elif category == "Assiduité":

            recommendations.append(
                "Suivi des absences et des retards avec la famille."
            )

        elif category == "Performance Générale":

            recommendations.append(
                "Mettre en place un suivi pédagogique individualisé."
            )

    return {

    "top_features":
        importance[:10],

    "semantic_causes":
        semantic_importance[:5],

    "recommendations":
        recommendations

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




