"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type Props = {
  implemented: number;
  notImplemented: number;
  notApplicable: number;
};

const ProgressChart = ({
  implemented,
  notImplemented,
  notApplicable,
}: Props) => {
  const data = [
    { name: "Implemented", value: implemented, color: "#D1B040" },
    { name: "Not Implemented", value: notImplemented, color: "#C43A4E" },
    { name: "Not Applicable", value: notApplicable, color: "#A2A2A2" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        User Control Status Overview
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            barSize={30} 
            radius={[10, 10, 0, 0]} 
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
