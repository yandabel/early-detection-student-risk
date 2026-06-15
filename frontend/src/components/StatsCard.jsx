import "./StatsCard.css";

const StatsCard = ({ title, value, color }) => {

return (
        <div
            className="stat-card"
            style={{
            borderLeft: `6px solid ${color}`
            }}
            > <h2>{value}</h2> <p>{title}</p> 
        </div>
        )

};

export default StatsCard;
