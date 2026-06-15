import "./header.css";

import {
  FaBell,
  FaCalendarAlt,
  FaUserCircle
} from "react-icons/fa";

const Header = () => {

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

  return (

    <header className="header">

      <div className="header-left">

        <h2>
          🎓 Système de Détection Précoce
        </h2>

        <p>
          {formattedDate}
        </p>

      </div>

      <div className="header-right">

        <div className="header-icon">

          <FaBell />

          <span className="badge">
            27
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