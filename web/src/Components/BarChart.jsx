import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ProductSalesBarChart = ({ products }) => {
  // Include all products in the chart
  const chartData = products; // No restriction on the number of products

  return (
    <div className="  flex gap-6 items-center  ">
      <BarChart
        width={600}
        height={550}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          interval={0} // Force all product names to display
        />
        <YAxis 
          domain={[0, 100]} // Restrict Y-axis range from 0 to 20
          ticks={[0,25,50,75,100]} // Explicit Y-axis tick values
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSold" fill="#CB7927" /> {/* Orange color */}
      </BarChart>
      
    </div>
  );
};

export default ProductSalesBarChart;
