import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const NetSalesLineChart = ({ data }) => {
  // Data should include months and net sales
  const chartData = data;

  return (
    <div className="  flex flex-col items-center">
         <p className="text-lg font-semibold mt-2 text-gray-500">Line chart that show the NetSlaes in each month</p>
      <LineChart
        width={500}
        height={500}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month"
        />
        <YAxis domain={[0, 500000]}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="netSales" stroke="#FF8000" strokeWidth={2} />
      </LineChart>
    </div>
  );
};

export default NetSalesLineChart;
