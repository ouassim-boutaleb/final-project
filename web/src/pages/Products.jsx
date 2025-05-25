import React, {  useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Rating, RatingStar, Pagination } from "flowbite-react";
import search from "../assets/icons/icons8-search.svg";
import api from "../utils/api";
import { useLocation } from "react-router-dom";
import { MyLoader } from "../Components/Skeleton";


const Products = () => {
  const location = useLocation()
  const [products, setProducts] = useState([]);
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
  
  const id = location.pathname.split('/').pop();
  
  
  const token = localStorage.getItem("accessToken");
  
useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/warehouse/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setProducts(response.data.products);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally {
      setLoading(false); 
    }
    };

    fetchProducts();
}, [id,token]);
 
 
  

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 8;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      
      <div className="container flex justify-center items-center">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none border-none text-sm bg-inherit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={search} className="w-4" alt="" />
        </div>
      </div>
      {loading  ? (
         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 mt-1">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <MyLoader key={index} />
                    ))}
                  </div>
      ): (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 container place-items-center">
        {paginatedProducts.map((product) => (
          <div className="mt-2 mb-6 relative flex" key={product.name} onClick={()=> window.location.href=`/product/${product.id}`}>
            <div className="flex flex-col border border-[#ccc] rounded-lg">
              <img
                src={product.image}
                style={{ width: "215px", height: "215px" }}
                className="rounded-md"
                alt={product.name}
              />
              <div className="mb-4">
                <div className="flex justify-between items-center mt-2 mx-2">
                  <p className="text-[14px]">{product.name}</p>
                  <span className="text-[14px]">
                    {product.price}{" "}
                    <span className="font-medium text-gray-800">DZ</span>{" "}
                  </span>
                </div>
                <div className="flex justify-between gap-4 items-center border border-[#ccc] rounded-xl py-1 px-1 mx-2 mt-1">
                  <span>
                    <Rating className="flex items-center gap-1">
                      <RatingStar /> {product.rating}
                    </Rating>
                  </span>
                  <span className="text-[14px] text-[#666666]">
                    {product.sold} sold
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      
      <div className="flex overflow-x-auto justify-center mb-6">
        <Pagination
          layout="pagination"
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
          previousLabel=""
          nextLabel=""
          showIcons
        />
      </div>
      <Footer />
    </div>
  );
};

export default Products;
