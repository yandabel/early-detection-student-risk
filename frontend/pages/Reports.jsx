import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../src/assets/logo.jpg";

import StatsCard from "../src/components/StatsCard";

import "../src/styles/reports.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Reports = () => {

const [students, setStudents] = useState([]);

useEffect(() => {


const data =
  JSON.parse(
    localStorage.getItem("studentsData")
  ) || [];

setStudents(data);

}, []);

const totalStudents = students.length;

const lowRisk = students.filter(
s => s.risk_label === "Faible"
).length;

const mediumRisk = students.filter(
s => s.risk_label === "Modéré"
).length;

const highRisk = students.filter(
s => s.risk_label === "Élevé"
).length;

const avgProbability =
students.length > 0
? (
students.reduce(
(sum, s) =>
sum + Number(s.probability),
0
) / students.length
).toFixed(2)
: 0;

// exporter le fichier excel

const exportExcel = () => {

  const reportData = students.map(
  student => ({

    "ID Élève":
      student.id_eleve,

    "Niveau":
      student.niveau,

    "Classe":
      student.classe,

    "Sexe":
      student.sexe,

    "Risque":
      student.risk_label,

    "Probabilité (%)":
      student.probability

  })
);

  const worksheet =
    XLSX.utils.json_to_sheet(
      reportData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Students Report"
  );

  const excelBuffer =
    XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array"
      }
    );

  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

  saveAs(
    fileData,
    "rapport_eleves.xlsx"
  );

};

// exporter le fichier pdf

const exportPDF = () => {

  const doc = new jsPDF();

  // Logo
  doc.addImage(
    logo,
    "PNG",
    150,
    10,
    40,
    20
  );

  const today = new Date();

  // Titre
  doc.setFontSize(18);

  doc.text(
    "Rapport de Détection Précoce",
    14,
    20
  );

  // Date
  doc.setFontSize(11);

  doc.text(
    `Date : ${today.toLocaleDateString()}`,
    14,
    30
  );

  // Résumé statistique
  doc.setFontSize(12);

  doc.text(
    `Total élèves : ${totalStudents}`,
    14,
    40
  );

  doc.text(
    `Risque faible : ${lowRisk}`,
    14,
    50
  );

  doc.text(
    `Risque modéré : ${mediumRisk}`,
    14,
    60
  );

  doc.text(
    `Risque élevé : ${highRisk}`,
    14,
    70
  );

  // Élèves à risque élevé
  const highRiskStudents =
    students.filter(
      s => s.risk_label === "Élevé"
    );

  // Top classes à risque
  const classesRiskData = Object.values(

    students.reduce((acc, student) => {

      if (student.risk_label !== "Élevé")
        return acc;

      const classe = student.classe;

      if (!acc[classe]) {

        acc[classe] = {
          classe,
          total: 0
        };

      }

      acc[classe].total++;

      return acc;

    }, {})

  )
    .sort(
      (a, b) =>
        b.total - a.total
    )
    .slice(0, 5);

  // Tableau Top Classes
  doc.setFontSize(13);

  doc.text(
    "Top 5 Classes à Risque",
    14,
    85
  );

  autoTable(doc, {

    startY: 90,

    head: [[
      "Classe",
      "Élèves à risque"
    ]],

    body:
      classesRiskData.map(
        c => [
          c.classe,
          c.total
        ]
      )

  });

  // Tableau Élèves à risque élevé
  const finalY =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(13);

  doc.text(
    "Élèves à Risque Élevé",
    14,
    finalY
  );

  autoTable(doc, {

    startY: finalY + 5,

    head: [[
      "ID",
      "Classe",
      "Niveau",
      "Probabilité"
    ]],

    body:
      highRiskStudents.map(
        student => [

          student.id_eleve,
          student.classe,
          student.niveau,
          `${student.probability}%`

        ]
      )

  });

  // Conclusion automatique
  const lastY =
    doc.lastAutoTable.finalY + 20;

  doc.setFillColor(
    239,
    246,
    255
  );

  doc.roundedRect(
    15,
    lastY - 5,
    180,
    55,
    3,
    3,
    "F"
  );

  doc.setTextColor(
    30,
    64,
    175
  );

  doc.setFontSize(14);

  doc.text(
    "CONCLUSION DU RAPPORT",
    105,
    lastY + 5,
    {
      align: "center"
    }
  );

  doc.setTextColor(
    0,
    0,
    0
  );

  doc.setFontSize(10);

  doc.text(

    `Le système a identifié ${highRisk} élèves présentant un risque élevé.

Les classes les plus concernées sont :

${classesRiskData
      .map(c => c.classe)
      .join(", ")}

Une intervention pédagogique ciblée est recommandée.`,

    25,
    lastY + 18

  );

  // Télécharger le PDF
  doc.save(
    "rapport_detection_precoce.pdf"
  );

};

return (

<div className="reports">

  <h1>
    Rapports
  </h1>
  <br />

  <p className="reports-subtitle">
    Génération et export des
    résultats de détection précoce.
  </p>

  <div className="reports-stats">

    <StatsCard
      title="Total élèves"
      value={totalStudents}
      color="#2563eb"
    />

    <StatsCard
      title="Risque Faible"
      value={lowRisk}
      color="#16a34a"
    />

    <StatsCard
      title="Risque Modéré"
      value={mediumRisk}
      color="#f59e0b"
    />

    <StatsCard
      title="Risque Élevé"
      value={highRisk}
      color="#dc2626"
    />

  </div>

  <div className="report-summary">

    <h2>
      Résumé Exécutif
    </h2>

    <ul>

      <li>
        Nombre total d'élèves :
        <strong>
          {" "}
          {totalStudents}
        </strong>
      </li>

      <li>
        Élèves à risque faible :
        <strong>
          {" "}
          {lowRisk}
        </strong>
      </li>

      <li>
        Élèves à risque modéré :
        <strong>
          {" "}
          {mediumRisk}
        </strong>
      </li>

      <li>
        Élèves à risque élevé :
        <strong>
          {" "}
          {highRisk}
        </strong>
      </li>

      <li>
        Probabilité moyenne :
        <strong>
          {" "}
          {avgProbability}%
        </strong>
      </li>

    </ul>

  </div>

  <div className="report-actions">

    <h2>
      Exporter le rapport
    </h2>

    <p>
      Génération automatique
      des rapports Excel et PDF
      pour les responsables pédagogiques.
    </p>
    <div className="export-buttons">

      <button
        className="btn btn-pdf"
        onClick={exportPDF}
      >
        📄 Télécharger PDF
      </button>

      <button
        className="btn btn-excel"
        onClick={exportExcel}
      >
        📊 Télécharger Excel
      </button>
    </div>

  </div>

  <div className="report-table">

    <h2>
      Élèves à Risque Élevé
    </h2>

    <table>

      <thead>

        <tr>
          <th>ID</th>
          <th>Classe</th>
          <th>Niveau</th>
          <th>Probabilité</th>
        </tr>

      </thead>

      <tbody>

        {
          students
            .filter(
              s =>
                s.risk_label ===
                "Élevé"
            )
            .map(student => (

              <tr
                key={
                  student.id_eleve
                }
              >

                <td>
                  {
                    student.id_eleve
                  }
                </td>

                <td>
                  {
                    student.classe
                  }
                </td>

                <td>
                  {
                    student.niveau
                  }
                </td>

                <td>
                  {
                    student.probability
                  }%
                </td>

              </tr>

            ))
        }

      </tbody>

    </table>

  </div>

</div>


);

};

export default Reports;
