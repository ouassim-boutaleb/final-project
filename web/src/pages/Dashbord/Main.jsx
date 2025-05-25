import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import MenuDashbord from "../../Components/MenuDashbord";
import Statistiques from "../../Components/Statistiques";
import NetSalesLineChart from "../../Components/Linechart";
import ProductSalesBarChart from "../../Components/BarChart";
import SalesChart from "../../Components/SalesChart";
import { Context } from "../../context/Context";
import api from "../../utils/api";
import { ThreeDot } from "react-loading-indicators";

const Main = () => {
  const { loading, setLoading, token } = useContext(Context);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
//   const salesData = [
//     { month: "Jan", product: "Product A", sales: 5000 },
//     { month: "Feb", product: "Product A", sales: 7000 },
//     { month: "Mar", product: "Product A", sales: 11000 },
//     { month: "Apr", product: "Product A", sales: 13000 },
//     { month: "May", product: "Product A", sales: 15000 },
//     { month: "Jun", product: "Product A", sales: 18000 },
//     { month: "Jul", product: "Product A", sales: 20000 },
//     { month: "Aug", product: "Product A", sales: 22000 },
//     { month: "Sep", product: "Product A", sales: 25000 },
//     { month: "Oct", product: "Product A", sales: 27000 },
//     { month: "Nov", product: "Product A", sales: 30000 },
//     { month: "Dec", product: "Product A", sales: 32000 },
//     { month: "Jan", product: "Product B", sales: 6000 },
//     { month: "Feb", product: "Product B", sales: 9000 },
//     { month: "Mar", product: "Product B", sales: 12000 },
//     { month: "Apr", product: "Product B", sales: 15000 },
//     { month: "May", product: "Product B", sales: 17000 },
//     { month: "Jun", product: "Product B", sales: 20000 },
//     { month: "Jul", product: "Product B", sales: 23000 },
//     { month: "Aug", product: "Product B", sales: 26000 },
//     { month: "Sep", product: "Product B", sales: 28000 },
//     { month: "Oct", product: "Product B", sales: 30000 },
//     { month: "Nov", product: "Product B", sales: 32000 },
//     { month: "Dec", product: "Product B", sales: 35000 },
//     { month: "Jan", product: "Product C", sales: 7000 },
//     { month: "Feb", product: "Product C", sales: 10000 },
//     { month: "Mar", product: "Product C", sales: 14000 },
//     { month: "Apr", product: "Product C", sales: 16000 },
//     { month: "May", product: "Product C", sales: 19000 },
//     { month: "Jun", product: "Product C", sales: 22000 },
//     { month: "Jul", product: "Product C", sales: 25000 },
//     { month: "Aug", product: "Product C", sales: 28000 },
//     { month: "Sep", product: "Product C", sales: 30000 },
//     { month: "Oct", product: "Product C", sales: 32000 },
//     { month: "Nov", product: "Product C", sales: 35000 },
//     { month: "Dec", product: "Product C", sales: 38000 },
//     { month: "Jan", product: "Product D", sales: 8000 },
//     { month: "Feb", product: "Product D", sales: 11000 },
//     { month: "Mar", product: "Product D", sales: 15000 },
//     { month: "Apr", product: "Product D", sales: 17000 },
//     { month: "May", product: "Product D", sales: 20000 },
//     { month: "Jun", product: "Product D", sales: 23000 },
//     { month: "Jul", product: "Product D", sales: 26000 },
//     { month: "Aug", product: "Product D", sales: 29000 },
//     { month: "Sep", product: "Product D", sales: 31000 },
//     { month: "Oct", product: "Product D", sales: 34000 },
//     { month: "Nov", product: "Product D", sales: 37000 },
//     { month: "Dec", product: "Product D", sales: 40000 },
//     { month: "Jan", product: "Product E", sales: 9000 },
//     { month: "Feb", product: "Product E", sales: 12000 },
//     { month: "Mar", product: "Product E", sales: 16000 },
//     { month: "Apr", product: "Product E", sales: 19000 },
//     { month: "May", product: "Product E", sales: 22000 },
//     { month: "Jun", product: "Product E", sales: 25000 },
//     { month: "Jul", product: "Product E", sales: 28000 },
//     { month: "Aug", product: "Product E", sales: 31000 },
//     { month: "Sep", product: "Product E", sales: 33000 },
//     { month: "Oct", product: "Product E", sales: 36000 },
//     { month: "Nov", product: "Product E", sales: 39000 },
//     { month: "Dec", product: "Product E", sales: 42000 },
//     { month: "Jan", product: "Product F", sales: 10000 },
//     { month: "Feb", product: "Product F", sales: 13000 },
//     { month: "Mar", product: "Product F", sales: 17000 },
//     { month: "Apr", product: "Product F", sales: 20000 },
//     { month: "May", product: "Product F", sales: 23000 },
//     { month: "Jun", product: "Product F", sales: 26000 },
//     { month: "Jul", product: "Product F", sales: 29000 },
//     { month: "Aug", product: "Product F", sales: 32000 },
//     { month: "Sep", product: "Product F", sales: 35000 },
//     { month: "Oct", product: "Product F", sales: 38000 },
//     { month: "Nov", product: "Product F", sales: 41000 },
//     { month: "Dec", product: "Product F", sales: 44000 },
//   ];
const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "https://backendhost-production-1804.up.railway.app/dashboard/net-sales-per-month",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log(response.data.netSales);
        setData(response.data.netSales);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching net sales:", error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchProductSales = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          "https://backendhost-production-1804.up.railway.app/dashboard/sales-per-product",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
        setProducts(response.data.sales);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product sales:", error);
      }
    };
 
    fetchProductSales();
  }, []);
    useEffect(() => {
        const fetchMonthlySales = async () => {
        try {
            setLoading(true);
            const response = await api.get(
            "https://backendhost-production-1804.up.railway.app/dashboard/monthly-sales-per-product",
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
            );
            console.log(response.data.products);
            setSalesData(response.data.products);
            // setSalesData(response.data.sales);
            // setLoading(false);
        } catch (error) {
            console.error("Error fetching monthly sales:", error);
        }
        };
    
        fetchMonthlySales();
    }, []);

  return (
    <motion.div
      className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar Animation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <MenuDashbord activeItem={"Dashboard"} />
      </motion.div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ThreeDot variant="bounce" color="#d1823d" size="large" />
        </motion.div>
      ) : (
        <motion.div
          className="bg-gray-50 p-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Dashboard Header */}
          <motion.div
            className="flex flex-col mx-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[26px] font-semibold">Dashboard</p>
            <Statistiques />
          </motion.div>

          {/* Chart Section */}
          <motion.div
            className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <NetSalesLineChart data={data} />
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <ProductSalesBarChart products={products} />
            </motion.div>
          </motion.div>

          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col mt-4 mb-4 p-4 border rounded-lg bg-white shadow-md">
                { salesData.length > 0?
              <SalesChart data={salesData} />
              : null
                }
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Main;