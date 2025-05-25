
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const SalesChart = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState(data[0].name); // Default to first product
  console.log("selectedProduct", selectedProduct);
  console.log("data", data);
  const uniqueProducts = [...new Set(data.map((item) => item.product))];

  const filteredData = data.filter((item) => item.name === selectedProduct);
  console.log("filteredData", filteredData);

  return (
    <div className="flex flex-col mt-4 mb-4 p-4 border rounded-lg bg-white shadow-md">
      <div className="flex justify-around items-center">
      <p className="text-lg font-semibold mt-2 text-gray-500">
        Line chart showing sales by product
      </p>
      
      <select
        className="mb-4 p-2 border rounded-md bg-white shadow"
        
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {data.map((product) => (
          <option key={product.name} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>
      </div>

      <LineChart width={1100} height={500} data={filteredData[0].monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" ticks={["February", "April", "June", "August", "October", "December"]} />
        <YAxis domain={[0, 90] } />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalSold" stroke="#FF8000" strokeWidth={2} />
      </LineChart>
    </div>
  );
};

export default SalesChart;
