import {NavLink} from "react-router-dom"
import "./sidebar.css"

import logo from "../assets/logo.jpg";

import {
 FaHome,
 FaChartBar,
 FaUserGraduate,
 FaBell,
 FaBrain,
 FaFileAlt
} from "react-icons/fa";

const Sidebar= () => {
    return (
        <div className="sidebar">
            
            <ul>

                <div className="sidebar-header">

                    <img
                        src={logo}
                        alt="Logo établissement"
                        className="sidebar-logo"
                    />

                    <h2>
                        Groupe Scolaire SandrinéO Oujda
                    </h2>

                    <p>
                        Système d'Alerte Précoce
                    </p>

                </div>

            <li>
                <NavLink to="/" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaHome className="icon" />
                Tableau de bord

                </NavLink>
            </li>



            <li>
                <NavLink to="/students" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaUserGraduate className="icon"/>
                Élèves

                </NavLink>
            </li>

            <li>
                <NavLink to="/analytics" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaChartBar className="icon"/>
                Statistiques

                </NavLink>
            </li>

            <li>
                <NavLink to="/explainability" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaBrain className="icon"/>
                Explications IA

                </NavLink>
            </li>

            <li>
                <NavLink to="/reports" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaFileAlt className="icon"/>
                Rapports
                </NavLink>
            </li>

            {/* <li>
                <NavLink to="/alerts" className={({isActive})=> 
                isActive ? "active-link" : ""}>
                <FaBell className="icon"/>
                Alerts
                </NavLink>
            </li> */}

            

            

            </ul>
            <div className="sidebar-footer">
                Version 1.0
                <br />
                Early Detection AI
            </div>
                    
        </div>
    )
}

export default Sidebar;