import { useEffect, useState } from "react";
import "../src/styles/analytics.css"
import StatsCard from "../src/components/StatsCard";
import RiskPieChart from "../src/components/RiskPieChart";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


const Analytics = () => {

  const [students, setStudents] = useState([]);

    useEffect(()=> {
    const data= JSON.parse(localStorage.getItem("studentsData")) || []

    console.log(data)

    setStudents(data)

  }, [])

  const totalStudents = students.length;

  const lowRisk =
    students.filter(
      s => s.risk_label === "Faible"
    ).length;

  const mediumRisk =
    students.filter(
      s => s.risk_label === "Modéré"
    ).length;

  const highRisk =
    students.filter(
      s => s.risk_label === "Élevé"
    ).length;

    //data

  const riskData = [
    {
      name: "Faible",
      value: lowRisk
    },
    {
      name: "Modéré",
      value: mediumRisk
    },
    {
      name: "Élevé",
      value: highRisk
    }
  ];

  const niveauData = [

  {
    niveau: "Primaire",

    Faible: students.filter(
      s =>
        s.niveau === "Primaire" &&
        s.risk_label === "Faible"
    ).length,

    Modéré: students.filter(
      s =>
        s.niveau === "Primaire" &&
        s.risk_label === "Modéré"
    ).length,

    Élevé: students.filter(
      s =>
        s.niveau === "Primaire" &&
        s.risk_label === "Élevé"
    ).length
  },

  {
    niveau: "Collège",

    Faible: students.filter(
      s =>
        s.niveau === "collège" &&
        s.risk_label === "Faible"
    ).length,

    Modéré: students.filter(
      s =>
        s.niveau === "collège" &&
        s.risk_label === "Modéré"
    ).length,

    Élevé: students.filter(
      s =>
        s.niveau === "collège" &&
        s.risk_label === "Élevé"
    ).length
  }

];

const sexeData = [

  {
    sexe: "Masculin",

    Faible: students.filter(
      s =>
        s.sexe === "Masculin" &&
        s.risk_label === "Faible"
    ).length,

    Modéré: students.filter(
      s =>
        s.sexe === "Masculin" &&
        s.risk_label === "Modéré"
    ).length,

    Élevé: students.filter(
      s =>
        s.sexe === "Masculin" &&
        s.risk_label === "Élevé"
    ).length
  },

  {
    sexe: "Féminin",

    Faible: students.filter(
      s =>
        s.sexe === "Féminin" &&
        s.risk_label === "Faible"
    ).length,

    Modéré: students.filter(
      s =>
        s.sexe === "Féminin" &&
        s.risk_label === "Modéré"
    ).length,

    Élevé: students.filter(
      s =>
        s.sexe === "Féminin" &&
        s.risk_label === "Élevé"
    ).length
  }

];

// les classes qui concentrent le plus d'élèves à risque

const classesRiskData = Object.values(
  students.reduce((acc, student ) => {
    const classe= student.classe

    if (!acc[classe]) {
      acc[classe] = {
        classe,
        elevesRisque: 0
      }
    }
    if(student.risk_label=== "Élevé"){
      acc[classe].elevesRisque +=1
    }

    return acc
  }, {})

)
.sort((a,b) => b.elevesRisque - a.elevesRisque).slice(0,10)


console.log(classesRiskData)
  return (

    <div className="analytics">

      <h1>Analytics</h1>

      <div className="analytics-stats">

        <StatsCard
          title="Total élèves"
          value={totalStudents}
          color="#2563eb"
        />

        <StatsCard
          title="Faible"
          value={lowRisk}
          color="#10B981"
        />

        <StatsCard
          title="Modéré"
          value={mediumRisk}
          color="#F59E0B"
        />

        <StatsCard
          title="Élevé"
          value={highRisk}
          color="#EF4444"
        />

      </div>

      <div className="chart-container">

        <RiskPieChart
          data={riskData}
        />
      </div>
      <div className="chart-card">
          <h2>Risque par niveau</h2>

          <ResponsiveContainer width= "100%" height={350} >

            <BarChart data={niveauData}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="niveau" />
              <YAxis />
              <Tooltip />
              <Legend />
                    <Bar
                      dataKey="Faible"
                      fill="#10B981"
                    />

                    <Bar
                      dataKey="Modéré"
                      fill="#F59E0B"
                    />

                    <Bar
                      dataKey="Élevé"
                      fill="#EF4444"
                    />
            </BarChart>
          </ResponsiveContainer>
      </div>

      <div className="chart-card">

        <h2>Risque par sexe</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={sexeData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="sexe" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Faible"
              fill="#10B981"
            />

            <Bar
              dataKey="Modéré"
              fill="#F59E0B"
            />

            <Bar
              dataKey="Élevé"
              fill="#EF4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="chart-card">


        <h2>
          Top 10 Classes à Risque
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <BarChart
            data={classesRiskData}
            layout="vertical"
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
            />

            <YAxis
              dataKey="classe"
              type="category"
            />

            <Tooltip />

            <Bar
              dataKey="elevesRisque"
              fill="#EF4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
};

export default Analytics;