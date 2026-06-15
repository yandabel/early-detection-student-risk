const TopRiskTable = ({students}) => {
    return (
        <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
        >
            <h3>🚨 Top 10 élèves à risque</h3>

            <table  style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        {/* <th>Niveau</th>
                        <th>Classe</th>
                        <th>Sexe</th> */}
                        <th>Risque</th>
                        <th>Probabilité</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student=> (
                        <tr key={student.student_id}>
                            <th>{student.student_id}</th>
                            {/* <th>{student.niveau}</th>
                            <th>{student.classe}</th>
                            <th>{student.sexe}</th> */}
                            <th>{student.risk_label}</th>
                            <th>{student.probability}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TopRiskTable;