import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrbitProgress } from "react-loading-indicators"; // Loading animation
import netsales from "../assets/icons/Netsales.svg";
import dilivered from "../assets/icons/dilivered.svg";
import dollar from "../assets/icons/dollar.svg";
import customer from "../assets/icons/costemers.svg";
import api from "../utils/api";

const Statistiques = () => {
  const token = localStorage.getItem("accessToken");

  // ✅ Initialize state with default values
  const [stats, setStats] = useState({
    netSales: null,
    delivredOrders: null,
    nOrders: null,
    nCustomers: null,
  });
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("https://backendhost-production-1804.up.railway.app/dashboard/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStats(response.data);
        setLoading(false); // ✅ Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 lg:gap-6 md:gap-4">
      {loading ? (
        // ✅ Show 4 placeholders while loading
        Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className="flex flex-col my-4 px-6 py-2 bg-white border border-[#E2E2E2] rounded-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
          >
            <motion.div className="flex justify-center items-center w-full h-16" animate={{ opacity: [0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <OrbitProgress color="#f4974e" size="small" text="" textColor="" />
            </motion.div>
          </motion.div>
        ))
      ) : (
        [
          { label: "Net Sales", value: `${stats.netSales || 0} DZD`, icon: netsales },
          { label: "Delivered", value: stats.delivredOrders || 0, icon: dilivered },
          { label: "No Orders", value: stats.nOrders || 0, icon: dollar },
          { label: "No Customers", value: stats.nCustomers || 0, icon: customer },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col my-4 px-6 py-2 bg-white border border-[#E2E2E2] rounded-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-[14px] font-medium">{item.label}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[20px] font-bold">{item.value}</span>
              <img src={item.icon} alt="" />
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default Statistiques;
