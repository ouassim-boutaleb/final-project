import React, { use, useContext, useEffect, useState } from "react";
import MenuDashbord from "../../Components/MenuDashbord";
import {
  Datepicker,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import api from "../../utils/api";
import { Context } from "../../context/Context";
import { ThreeDot } from "react-loading-indicators";
import { motion } from "framer-motion";

const Store = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("accessToken");
  const { loading, setLoading } = useContext(Context);
  const [date, setDate] = useState(new Date().toDateString());
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("https://backendhost-production-1804.up.railway.app/products/warehouse", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data.products);
        setFilteredProducts(response.data.products.filter(
          (product) => new Date(product.createdAt).toDateString() === new Date().toDateString()
        ));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate.toDateString());
    setFilteredProducts(products.filter((product) => {
      return new Date(product.createdAt).toDateString() === newDate.toDateString();
    }));
  };

  return (
    <motion.div 
     
      className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr] store"
    >
      <div>
        <MenuDashbord activeItem={"Store Availability"} />
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center items-center h-screen"
        >
          <ThreeDot variant="bounce" color="#d1823d" size="large" />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-gray-50"
        >
          <motion.div
            className="bg-white mt-16 lg:mx-3 mx-1 h-screen"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[21px] text-[#3B3E45] font-semibold ml-3 py-2">
              My Store
            </p>

            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
              className="ml-4 mt-2 mb-2 date"
            >
              <Datepicker className="w-fit" onChange={handleDateChange} />
            </motion.div>

            <div>
              <Table hoverable>
                <TableHead className="border-b-2 border-gray-100">
                  <TableHeadCell className="bg-white text-nowrap">Product Id</TableHeadCell>
                  <TableHeadCell className="bg-white">Product</TableHeadCell>
                  <TableHeadCell className="bg-white">Availability in Stock</TableHeadCell>
                  <TableHeadCell className="bg-white">Price</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {filteredProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.id || "N/A"}</TableCell>
                      <TableCell>{product.name || "N/A"}</TableCell>
                      <TableCell className="px-16">{product.stock || "N/A"}</TableCell>
                      <TableCell>{product.price || "N/A"} <span>DZ</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Store;
