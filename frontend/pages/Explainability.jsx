import { useState, useEffect } from "react";
import api from "../src/services/api";
import "../src/styles/explainability.css";

import {
ResponsiveContainer,
BarChart,
Bar,
Cell,
XAxis,
YAxis,
CartesianGrid,
Tooltip
} from "recharts";



const Explainability = () => {

const [students, setStudents] = useState([]);
const [selectedStudent, setSelectedStudent] = useState("");
const [explanation, setExplanation] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {


const data =
  JSON.parse(
    localStorage.getItem("studentsData")
  ) || [];

setStudents(data);


}, []);

const handleExplain = async () => {


if (!selectedStudent) return;

try {

  setLoading(true);

  const student = students.find(
    s => s.id_eleve === selectedStudent
  );

  if (!student) return;

  const {
    id_eleve,
    niveau,
    classe,
    sexe,

    student_id,
    risk_class,
    risk_label,
    probability,

    ...featuresOnly

  } = student;

  const response =
    await api.post(
      "/explain-student",
      {
        student:
          Object.values(featuresOnly)
      }
    );

  const sortedFeatures =
    [...response.data.top_features]
      .sort(
        (a, b) =>
          Math.abs(b.value) -
          Math.abs(a.value)
      );

  setExplanation({
    student,
    features: sortedFeatures
  });

} catch (error) {

  console.error(error);

} finally {

  setLoading(false);

}


};

const positiveFactors =
explanation?.features
?.filter(f => f.value > 0)
?.slice(0, 5) || [];

const negativeFactors =
explanation?.features
?.filter(f => f.value < 0)
?.slice(0, 5) || [];

return (


<div className="explainability">

  <h1>
    Explainable AI
  </h1>
  <br />

  <p className="subtitle">
    Comprendre pourquoi le modèle
    classe un élève à risque.
  </p>

  <div className="selector-card">

    <h3>
      Sélectionner un élève
    </h3>

    <select
      value={selectedStudent}
      onChange={(e) =>
        setSelectedStudent(
          e.target.value
        )
      }
    >

      <option value="">
        Choisir un élève
      </option>

      {
        students.map(student => (

          <option
            key={student.id_eleve}
            value={student.id_eleve}
          >
            {student.id_eleve}
            {" - "}
            {student.classe}
          </option>

        ))
      }

    </select>

    <button
      className="btn"
      onClick={handleExplain}
    >
      Analyser
    </button>

  </div>

  {
    loading && (
      <p>
        Analyse en cours...
      </p>
    )
  }

  {
    explanation && (

      <>

        <div className="student-summary">

          <h2>
            Profil Élève
          </h2>

          <div className="summary-grid">

            <div>
              <strong>ID :</strong>
              {" "}
              {explanation.student.id_eleve}
            </div>

            <div>
              <strong>Niveau :</strong>
              {" "}
              {explanation.student.niveau}
            </div>

            <div>
              <strong>Classe :</strong>
              {" "}
              {explanation.student.classe}
            </div>

            <div>
              <strong>Risque :</strong>
              {" "}
              {explanation.student.risk_label}
            </div>

            <div>
              <strong>Probabilité :</strong>
              {" "}
              {explanation.student.probability}%
            </div>

          </div>

        </div>

        <div className="chart-card">

          <h2>
            Facteurs d'influence SHAP
          </h2>

          <ResponsiveContainer
            width="100%"
            height={500}
          >

            <BarChart
              data={explanation.features}
              layout="vertical"
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
              />

              <YAxis
                dataKey="feature"
                type="category"
                width={220}
                reversed
              />

              <Tooltip
                formatter={(value) =>
                  Number(value).toFixed(3)
                }
              />

              <Bar dataKey="value">

                {
                  explanation.features.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          entry.value > 0
                            ? "#dc2626"
                            : "#16a34a"
                        }
                      />

                    )
                  )
                }

              </Bar>

            </BarChart>

          </ResponsiveContainer>

          <div className="shap-legend">

            <span
              className="legend-risk"
            >
              🔴 Augmente le risque
            </span>

            <span
              className="legend-safe"
            >
              🟢 Réduit le risque
            </span>

          </div>

        </div>

        <div className="ai-summary">

          <h2>
            🤖 Interprétation automatique
          </h2>

          <p>

            Les facteurs qui
            augmentent principalement
            le risque sont :

            <strong>
              {" "}
              {
                positiveFactors
                  .map(
                    f => f.feature
                  )
                  .join(", ")
              }
            </strong>

          </p>

          <p>

            Les facteurs qui
            réduisent principalement
            le risque sont :

            <strong>
              {" "}
              {
                negativeFactors
                  .map(
                    f => f.feature
                  )
                  .join(", ")
              }
            </strong>

          </p>

        </div>

      </>

    )
  }

</div>

);

};

export default Explainability;
