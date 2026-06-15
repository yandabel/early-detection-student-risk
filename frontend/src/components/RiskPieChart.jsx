import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = [
  "#10B981",
  "#F59E0B",
  "#EF4444"
];

const RiskPieChart = ({ data }) => {

  return (
    <PieChart width={500} height={350}>

      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>
  );
};

export default RiskPieChart;