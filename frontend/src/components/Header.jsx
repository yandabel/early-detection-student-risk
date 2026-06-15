import "./header.css";

import { useLocation }
from "react-router-dom";

import {
  FaBell,
  FaCalendarAlt,
  FaUserCircle
} from "react-icons/fa";

const Header = () => {

  const today = new Date();
  const location= useLocation()

  const pageTitles = {

  "/":
    "🏠 Tableau de Bord",

  "/students":
    "👨‍🎓 Gestion des Élèves",

  "/analytics":
    "📊 Analyses et Statistiques",

  "/explainability":
    "🧠 Explicabilité de l'IA",

  "/reports":
    "📄 Rapports et Exportation"

};

const pageDescriptions = {

      "/": "Vue générale du système",

      "/students":
        "Gestion et suivi des élèves",

      "/analytics":
        "Analyse des risques et tendances",

      "/explainability":
        "Comprendre les décisions du modèle",

      "/reports":
        "Exportation et génération de rapports"

    };

const currentTitle = pageTitles[location.pathname] || "🎓 Système de Détection Précoce";

  const formattedDate =
    today.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

  // recuperer dynamiquement le nombres des eleves ont risque élevé
    
    const students =
    JSON.parse(
      localStorage.getItem(
        "studentsData"
      )
    ) || [];

    const highRisk =
    students.filter(
      s => s.risk_label === "Élevé"
    ).length;
      return (

    <header className="header">

      <div className="header-left">

        <h2>
          {currentTitle}
        </h2>



          <p>
            {
              pageDescriptions[
                location.pathname
              ]
            }
          </p>

      </div>

      <div className="header-right">

        <div className="header-icon">

          <FaBell />

          <span className="badge">
            {highRisk}
          </span>

        </div>

        <div className="header-icon">

          <FaCalendarAlt />

        </div>

        <div className="user-info">

          <FaUserCircle />

          <span>
            Administrateur
          </span>

        </div>

      </div>

    </header>

  );

};

export default Header;