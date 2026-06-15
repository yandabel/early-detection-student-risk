const KPIcard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderLeft: `6px solid ${color}`,
        textAlign: "center"
      }}
    >
      <h4>{title}</h4>

      <h2
        style={{
          color: color,
          marginTop: "10px"
        }}
      >
        {value}
      </h2>
    </div>
  );
};

export default KPIcard;