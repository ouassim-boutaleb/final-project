import React, {useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Rating, RatingStar } from "flowbite-react";
import filter from "../assets/icons/filter.svg";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { MyLoader } from "../Components/Skeleton";

const Suppliers = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [filterWarehouses, setFilterWarehouses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
    const [radius, setRadius] = useState(100); 
  const [appliedRadius, setAppliedRadius] = useState(radius);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
  
    const getSuppliers = async () => {
      try {
        const response = await api.get("https://backendhost-production-1804.up.railway.app/filtering/warehouses", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log(response.data)
        // Filter suppliers based on the user category
        const filteredSuppliers = response.data.warehouses.filter(supplier => 
          supplier.category === user.category
        );
  
        setPersons(filteredSuppliers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
  
    getSuppliers();
  }, []);
  
  
 const getFilteredWarehouses = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await api.get(
      `https://backendhost-production-1804.up.railway.app/filtering/warehouses/nearby?radius=${radius}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    setFilterWarehouses(response.data.warehouses);
    setPersons(response.data.warehouses);
  } catch (error) {
    console.error("Error fetching nearby warehouses:", error);
  }
};

useEffect(() => {
  if (selectedFilter === "distance") {
    getFilteredWarehouses();
  }
}, [selectedFilter]); 
const handleApplyFilter = () => {
  setAppliedRadius(radius); // ✅ Update appliedRadius only when button is clicked
  getFilteredWarehouses(); // ✅ Trigger filtering manually
};


  const handleFilterChange = (event) => {
    const selected = event.target.value;
    setSelectedFilter(selected);
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (selected === "distance") {
      setPersons(filterWarehouses.filter(supplier => supplier.category === user.category)); // Show nearby warehouses filtered by category
    } else if (selected === "rating") {
      setPersons([...persons].sort((a, b) => b.rating - a.rating)); // Sort by rating (descending)
    } else {
      // Ensure "Show All" still filters by category
      api.get("https://backendhost-production-1804.up.railway.app/filtering/warehouses", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
        .then((response) => {
          const filteredSuppliers = response.data.warehouses.filter(supplier => supplier.category === user.category);
          setPersons(filteredSuppliers);
        })
        .catch((error) => console.error("Error fetching all warehouses:", error));
    }
  };
  
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user.category)


  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Sidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      <Navbar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />

      <div className="container mt-2">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-3xl">Suppliers</h2>
          <div className="flex gap-2">
            <select className="border-2 border-gray-300 text-sm px-2" onChange={handleFilterChange} value={selectedFilter}>
              <option value="all">Show All</option>
              <option value="distance">Filter by: Nearby</option>
              <option value="rating">Filter by: Rating</option>
            </select>
            <img src={filter} alt="Filter icon" />
          </div>
        </div>
       {selectedFilter === "distance" && (
  <div className="mt-4 flex items-center gap-2">
    <label htmlFor="radius" className="font-semibold text-gray-700">Radius (km):</label>
    <input
      type="text"
      id="radius"
      className="border-2 border-gray-300 text-sm px-2 py-1 rounded-md w-20"
      value={radius}
      onChange={(e) => setRadius(e.target.value)}
     
    />
    <button 
      onClick={handleApplyFilter} 
      className="bg-orange-400 text-white text-xs px-2 py-1 rounded-xl"
    >
      Apply
    </button>
  </div>
)}


        {loading === false ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 mt-1">
            {persons.map((person, index) => (
              <div className="mt-2 mb-6 relative" key={index}>
                <Link to={`/products/${person.id}`}>
                  <div className="border border-[#B9B9B9] rounded-xl overflow-hidden">
                    <span className="font-medium absolute bg-gray-200 flex left-2 top-2 px-2 rounded-full">
                      {person.rating}
                      <Rating>
                        <RatingStar />
                      </Rating>
                    </span>
                    <div className="w-full h-[200px]">
                      <img src={person.profileImage} alt="" className="w-full h-full" />
                    </div>
                    <div className="flex justify-around items-center mt-1">
                      <p className="font-semibold text-[16px]">{person.firstname}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-[14px] text-[#202224]">{person.phoneNumber}</p>
                      <p className="text-[14px] text-[#FF6F00]">{person.region}</p>
                      <span className="mt-1 my-4 border border-[#979797] rounded-md text-[14px] text-[#767676] px-8 py-1">Stock</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 mt-1">
            {Array.from({ length: 8 }).map((_, index) => (
              <MyLoader key={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Suppliers;
