import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import SidebarRev from "../Components/SidebarRev";
import edit from "../assets/icons/edit.svg";
import api from "../utils/api";
import { Context } from "../context/Context"; // Importing context for global state management
import { ThreeDot } from "react-loading-indicators"; // Importing a loading spinner component

const Revenue = () => {
  const [updatedData, setUpdatedData] = useState({});
  const [editField, setEditField] = useState(null); // Tracks the field being edited
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const { fetchUserData, userData, setUserData, loading, token, getImage } =
    useContext(Context);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    getImage();
  }, []);

  // Function to update user data
  const updateUserData = async (updatedField) => {
    try {
      console.log("Sending updated field to API:", updatedField); // Debug log
      const response = await api.patch(
        "https://backendhost-production-1804.up.railway.app/dashboard/profile",
        { ...updatedField },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update successful. API response:", response.data); // Debug log

      // Automatically update userData state with new value
      setUserData((prev) => ({
        ...prev,
        ...updatedField, // Merge updated field into userData
      }));

    } catch (error) {
      console.error(
        "Error updating user data:",
        error.response?.data || error.message
      ); // Log error
    }
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setUpdatedData({ ...updatedData, [field]: value });
  };

  const handleUpdate = async (field) => {
    if (updatedData[field] && updatedData[field] !== userData[field]) {
      await updateUserData({ [field]: updatedData[field] });
    } else {
      console.log("No changes detected for field:", field);
    }
    setEditField(null); // Exit edit mode
  };

  return (
    <div>
      {/* Sidebar and Navbar components */}
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ThreeDot variant="bounce" color="#d1823d" size="large" />
        </div>
      ) : (
        <div className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr] gap-6 mx-10">
          <SidebarRev active={"Account"} />
          <div className="bg-[#FBFBFE] container px-4 pt-6 mt-10 max-h-screen rounded-lg">
            <p className="text-[22px] font-semibold">Account Details</p>
            <div className="bg-inherit mt-2">
              {userData &&
                Object.keys(userData)
                  .filter(
                    (field) =>
                      field !== "id" &&
                      field !== "email" &&
                      field !== "profileImage" &&
                      field !== "emergencyContact"
                  ) // Exclude specific fields
                  .map((field) => (
                    <div key={field} className="mb-10">
                      <div className="flex justify-between mt-1 border border-[#A0A5BA] rounded-xl py-2 px-2">
                        {editField === field ? (
                          <input
                            type="text"
                            className="border-none text-black px-0 w-full py-0 font-medium text-[14px] bg-inherit focus:outline-none focus:ring-blue-500"
                            defaultValue={userData[field] || ""}
                            onChange={(event) => handleChange(event, field)}
                            onBlur={() => handleUpdate(field)} // Automatically update and re-render
                          />
                        ) : (
                          <>
                            <span className="font-semibold text-[14px]">
                              {userData[field] || "Not provided"}
                            </span>
                            <button
                              className="text-[#FF6F00] text-[12px] font-semibold flex gap-1"
                              onClick={() => setEditField(field)}
                            >
                              <img src={edit} alt="" />
                              {userData[field] ? "Edit" : "Add"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
