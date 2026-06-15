
import React, { Component } from 'react'
import { useState } from 'react'
import api from "../src/services/api"
import "../src/styles/daschboard.css"

import Sidebar from '../src/components/Sidebar'
import KPIcard from '../src/components/KPIcard'
import RiskPieChart from '../src/components/RiskPieChart'
import FileUploader from "../src/components/FileUploader";
import TopRiskTable from '../src/components/TopRiskTable'

const Dashboard = ()=> {

  const [students, setStudents]= useState([])
  const [predictions, setPredictions]= useState([])
  const [studentsData, setStudentsData]=useState([])

  const totalStudents = predictions.length

  const lowRisk = predictions.filter(
    p=> p.risk_label === "Faible"
  ).length

  const mediumRisk = predictions.filter(
    p=> p.risk_label === "Modéré"
  ).length

  const highRisk = predictions.filter(
    p=> p.risk_label === "Élevé"
  ).length

  const pieData= [
    {name: "Faible", value: lowRisk},
    {name: "Modéré", value: mediumRisk},
    {name: "Élevé", value: highRisk}
  ]

  // Top 10 élèves à risque je dois filtrer tout d'abord avec la classe Risque Élevé

  const topRiskStudents = predictions
    .filter(
      p => p.risk_label === "Élevé"
    )
    .sort(
      (a, b) =>
        b.probability - a.probability
    )
    .slice(0, 10);
                                     
                                    

  const handleDataLoaded = async(data) => {

    if (!data || data.length === 0) {
      console.log("Aucune donnée")
      return
    } 

    setStudents(data)

    console.log(
      "Nombre colonnes premier élève :",
      Object.keys(data[0]).length
    );

    console.log(
      Object.keys(data[0])
    );
  

    try {
      const studentsValues = data
        .filter(student => student && typeof student === "object")
        .map(student => {

          const {
            id_eleve,
            niveau,
            classe,
            sexe,
            ...featuresOnly
          } = student;

          return Object.values(featuresOnly);

        });

      console.log("Nombre d'élèves filtrés :", studentsValues.length);

      if (studentsValues.length > 0) {
        console.log(
          "Nombre de colonnes envoyées :",
          studentsValues[0].length
        );
        console.log(
          "Premier élève :",
          studentsValues[0]
        );
      }
      const response = await api.post("/predict-batch", {student : studentsValues})

      setPredictions(response.data)

      const studentsWithRisk =  data.map(
        (student,index) => ({
          ...student,
          ...response.data[index]
          
        })
      )
      setStudentsData(studentsWithRisk)
      // Pour préparer la navigation entre pages :
      localStorage.setItem(
        "studentsData",
        JSON.stringify(studentsWithRisk)
      );
      
      console.log(studentsWithRisk)

    } catch (error){
      console.error(error)
    }
  }
    return (
      <div className="dashboard" > 
      

      <div  className="div1">

        <h1>
          Détection précoce des eleves
        </h1>

        <div className="welcome-card">

          <h2>
            👋 Bienvenue dans le système
          </h2>

          <p>
            Cette plateforme permet d'identifier
            les élèves à risque grâce à
            l'intelligence artificielle afin
            d'améliorer la prise de décision
            pédagogique.
          </p>

        </div>

        <div className="div2">

          {/* KPI */}

          <KPIcard
            title="Total des élèves"
            value={totalStudents}
            color="#3B82F6"
          />

          <KPIcard
            title="Risque faible"
            value={lowRisk}
            color="#10B981"
          />

          <KPIcard
            title="Risque modéré"
            value={mediumRisk}
            color="#F59E0B"
          />

          <KPIcard
            title="risque élevé"
            value={highRisk}
            color="#EF4444"
          />


        </div>

        
        <div className="upload-card">

          <h3>
            📂 Importer un fichier Excel
          </h3>

          <FileUploader
            onDataLoaded={handleDataLoaded}
          />

        </div>

        <div className="info-box">

        <span>
          Élèves chargés
        </span>

        <strong>
          {students.length}
        </strong>

      </div>

      <div className="info-box">

      <span>
        Prédictions reçues 
      </span>

      <strong>
        {predictions.length}
      </strong>

       </div>

        

        <div className="analytics-section">

          <div className="chart-card">

            <RiskPieChart
              data={pieData}
            />

          </div>

          <div className="chart-card">

            <TopRiskTable
              students={topRiskStudents}
            />

          </div>

        </div>
        

      </div>
      
      </div>
      
    )
  }

export default Dashboard