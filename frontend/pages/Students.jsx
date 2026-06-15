
import { useState, useEffect } from 'react'
import "../src/styles/students.css"
import StatsCard from '../src/components/StatsCard'
import Sidebar from '../src/components/Sidebar'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Cell,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import api from '../src/services/api'

import {
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";

const Students = ()=> {
  const [students, setStudents]= useState([])
  const [search, setSearch]= useState("")

  // ajoute le button voir Interpretation dans le Modal
  const [showInterpretation, setShowInterpretation] = useState(false);

  // states pour la fonction d'explication
  const [explanation, setExplanation] = useState(null);
  const [semanticCauses, setSemanticCauses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false)

  // tous les filtres possibles
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");
  const [selectedClasse, setSelectedClasse] = useState("Tous");
  const [selectedSexe, setSelectedSexe] = useState("Tous");
  const [selectedRisk, setSelectedRisk] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1)
  const [studentPerPage, setStudentPerPage]= useState(10)

  // des donnees pour la carte statiques

  const totalStudents = students.length

  const lowRisk = students.filter(
    p=> p.risk_label === "Faible"
  ).length

  const mediumRisk = students.filter(
    p=> p.risk_label === "Modéré"
  ).length

  const highRisk = students.filter(
    p=> p.risk_label === "Élevé"
  ).length

  //useEffect suivante ca nous permettre de recuperrer les donnees du page Daschboard.jsx
  useEffect(()=> {
    const data= JSON.parse(localStorage.getItem("studentsData")) || []

    console.log(data)

    setStudents(data)

  }, [])


  // generer automatiquemet les listes de filtres

  const niveaux = ["Tous", ...new Set(students.map(s=>s.niveau))]
  const classes = ["Tous", ...new Set(students.map(s=>s.classe))]
  const sexes = ["Tous", ...new Set(students.map(s=>s.sexe))]

  const availableClasses =

      selectedNiveau === "Tous"

      ? [...new Set(
          students.map(
            s => s.classe
          )
        )]

      : [...new Set(

          students

          .filter(
            s =>
              s.niveau ===
              selectedNiveau
          )

          .map(
            s => s.classe
          )

        )];

  const filteredStudents = 
  students.filter(student => {
    const matchSearch = 
          String(student.risk_label)
          .toLowerCase()
          .includes(search.toLowerCase())

    const matchNiveau = 
          selectedNiveau === "Tous" || 
          student.niveau=== selectedNiveau   
    
    const matchClasse = 
          selectedClasse === "Tous" || 
          student.classe=== selectedClasse
  
    const matchSexe = 
          selectedSexe === "Tous" || 
          student.sexe === selectedSexe 
    
    const matchRisk = 
          selectedRisk === "Tous" || 
          student.risk_label=== selectedRisk

          return (
          matchSearch &&
          matchNiveau &&
          matchClasse &&
          matchSexe &&
          matchRisk
        )
  }

    
)



  // faire la pagination
  const indexOfLastStudent = currentPage * studentPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentPerPage
  const currentStudent = filteredStudents.slice(indexOfFirstStudent,indexOfLastStudent)

  // la fonction d'explication

  const handleExplain = async(student) => {
    try {
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
    console.log(
      "Features :",
      Object.values(featuresOnly).length
    );

   // après la prédiction du modèle, je vois qu'il a ajouté 4 variables (student_id,
    //   risk_class,
    //   risk_label,
    //   Probability). c'est la raison pour laquelle je les efface pour récupérer juste 78 features
    const response = await api.post(
      "/explain-student",{

        student: Object.values(featuresOnly)

      }
        
      
    );
    
    const sortedFeatures = [...response.data.top_features]
    .sort(
      (a, b) =>
        Math.abs(b.value) - Math.abs(a.value)
    );

    console.log(response.data);

    setExplanation(sortedFeatures);
    setSemanticCauses(
      response.data.semantic_causes || []
    );

    setRecommendations(
      response.data.recommendations || []
    );

    setShowModal(true);

    } catch (err) {
      console.log(err)

    }

  }

  // Calculer les facteurs positifs et négatifs
  const positiveFactors =
  explanation?.filter(
    item => item.value > 0
  ).slice(0,5) || [];

  const negativeFactors =
    explanation?.filter(
      item => item.value < 0
    ).slice(0,5) || [];

    return (
        <div className="students" >
          
          <h1>Liste des élèves</h1>
          <div className="students-stats">

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
          <input 
           className='search-input'
           type="text"
           placeholder='Rechercher'
           value={search}
           onChange={(e)=> setSearch(e.target.value)}
           />

            <div className='filters' >

              <select
                value={selectedNiveau}
                onChange={(e)=>{

                  setSelectedNiveau(
                    e.target.value
                  );

                  setSelectedClasse(
                    "Tous"
                  );

                }}
              >
                {niveaux.map(n => (
                  <option key={n}>
                    {n}
                  </option>
                ))}
              </select>

              <select
                value={selectedClasse}
                onChange={(e) =>
                  setSelectedClasse(e.target.value)
                }
              >
                
                  <option value="Tous">
                    Tous
                  </option>
                   {
                    availableClasses.map(
                      classe => (

                        <option
                          key={classe}
                          value={classe}
                        >
                          {classe}
                        </option>

                      )
                    )
                  }
                
              </select>

              <select
                value={selectedSexe}
                onChange={(e) =>
                  setSelectedSexe(e.target.value)
                }
              >
                {sexes.map(s => (
                  <option key={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={selectedRisk}
                onChange={(e) =>
                  setSelectedRisk(e.target.value)
                }
              >
                <option>Tous</option>
                <option>Faible</option>
                <option>Modéré</option>
                <option>Élevé</option>
              </select>

            </div>

            <h3>
              Résultats : {filteredStudents.length}
            </h3>


          <div className="table-container">
            <table  className='students-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Niveau</th>
                  <th>Classe</th>
                  <th>Sexe</th>
                  <th>Risque</th>
                  <th>Probabilité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudent.map(student=> (
                  <tr key={student.id_eleve}>
                    <td>{student.id_eleve}</td>
                    <td>{student.niveau}</td>
                    <td>{student.classe}</td>
                    <td>{student.sexe}</td>
                    <td>
                      <span
                        className={
                          student.risk_label === "Élevé"
                            ? "risk-high"
                            : student.risk_label === "Modéré"
                            ? "risk-medium"
                            : "risk-low"
                        }
                      >
                        {student.risk_label}
                      </span>

                    </td>
                    <td>{student.probability}%</td>
                    <td> <button
                              className="btn"
                              onClick={() =>handleExplain(student)}
                              >
                              Voir détails
                            
                            </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">

            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
            >
              <FaArrowLeft className='arrow'/>
               Précédent
            </button>

            <span>
              Page {currentPage} / {
                Math.ceil(
                  filteredStudents.length /
                  studentPerPage
                )
              }
            </span>

            <button
              className="btn"
              disabled={
                currentPage ===
                Math.ceil(
                  filteredStudents.length /
                  studentPerPage
                )
              }
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
            >
              
              Suivant 
              <FaArrowRight className='arrow' />
            </button>

          </div>

          {/* Modal */}

          {
            showModal && explanation && (

              <div className="modal-overlay" onClick={()=>setShowModal(false)}>

                <div className="modal" onClick={e=>e.stopPropagation()}>

                  <button
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>

                  <h2>
                    🧠 Explainability
                  </h2>

                  <h3>
                    Top facteurs de risque
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={450}
                  >

                    <BarChart
                      data={explanation}
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 30,
                        left: 80,
                        bottom: 10
                      }}
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

                      <Bar dataKey="value"
>
                          {
                            explanation.map((entry,index)=>(
                              <Cell
                                key={index}
                                fill={
                                  entry.value > 0
                                  ? "#dc2626"
                                  : "#16a34a"
                                }
                              />
                            ))
                          }
                      </Bar>
                      

                    </BarChart>



                  </ResponsiveContainer>
                  {/* explication des couleur */}
                  <div className="shap-legend">
                      <span style={{color:"#dc2626"}}>
                        🔴 Augmente le risque
                      </span>

                      <span style={{color:"#16a34a", marginLeft:"20px"}}>
                        🟢 Réduit le risque
                      </span>
                    </div>

                    {/* ajouter un resumer IA explicatif */}
                    <div className="interpretation-btn-container">
                      <button
                        className="btn"
                        onClick={() =>
                          setShowInterpretation(
                            !showInterpretation
                          )
                        }
                      >
                        Voir interprétation
                      </button>
                    </div>

                    {
                    showInterpretation && (

                    <div className="ai-summary">

                      <h4>
                        🎯 Diagnostic pédagogique
                      </h4>

                      <p>

                        Les domaines qui influencent
                        principalement le risque de cet
                        élève sont :

                      </p>

                      <div className="causes-grid">

                        {
                          semanticCauses.map(
                            cause => (

                              <div
                                key={cause.category}
                                className={
                                  cause.value > 0
                                  ? "cause-risk"
                                  : "cause-strength"
                                }
                              >

                                <h5>
                                  {cause.category}
                                </h5>

                                <span>

                                  {
                                    cause.value > 0

                                    ? "⚠️ Facteur de risque"

                                    : "✅ Point fort"

                                  }

                                </span>

                              </div>

                            )
                          )
                        }

                        

                      </div>
                  {
                      recommendations.length > 0 && (

                      <div className="recommendations">

                        <h4>
                          📋 Recommandations pédagogiques
                        </h4>

                        <ul>

                          {
                            recommendations.map(
                              (rec,index) => (

                                <li key={index}>
                                  {rec}
                                </li>

                              )
                            )
                          }

                        </ul>

                      </div>

                      )}

                    </div>

                    )}

                  <button
                    className="btn"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Fermer
                  </button>

                </div>

              </div>

            )
          }


        </div>
    )
  }

export default Students