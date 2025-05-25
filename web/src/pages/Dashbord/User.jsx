import React, { useState, useEffect, useContext } from "react";
import MenuDashbord from "../../Components/MenuDashbord";

import secure from "../../assets/icons/secure.svg";
import cle from "../../assets/icons/cle.svg";
import eye from "../../assets/icons/eye2.svg";
import api from "../../utils/api";
import { Context } from "../../context/Context";
import { ThreeDot } from "react-loading-indicators";
import Geocoding from "../../Components/Geocoding";
import { motion } from "framer-motion";

const User = () => {
  const [userData, setUserData] = useState(null); // Store user information
  const [editField, setEditField] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [imagePath, setImagePath] = useState(null); // Store image preview
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const token = localStorage.getItem("accessToken");
  const { loading, setLoading } = useContext(Context);
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(
          "https://backendhost-production-1804.up.railway.app/dashboard/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setImagePath(response.data.user.profileImage);
        setUserData(response.data.user); // Update with actual user data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, setLoading]);

  // Update user data
  const updateUserData = async (updatedField) => {
    try {
      const response = await api.patch(
        "https://backendhost-production-1804.up.railway.app/dashboard/profile",
        updatedField,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData((prev) => ({ ...prev, ...updatedField })); // Merge updated field into userData
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Upload profile image
  const uploadImage = async () => {
    try {
      const data = {
        imageBase64: imagePath, // Use the selected file
      };
      // Ensure the key matches backend expectation
      const response = await api.post(
        "https://backendhost-production-1804.up.railway.app/dashboard/upload-profile-image",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setUpdatedData({ ...updatedData, [field]: value }); // Store the field and value for update
  };

  const handleUpdate = (field) => {
    if (updatedData[field]) {
      updateUserData({ [field]: updatedData[field] });
    }
    setEditField(null); // Exit edit mode
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePath(reader.result); // Update the image preview
      };
      reader.readAsDataURL(file);
      setImageFile(file); // Store the file for upload
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click(); // Trigger file input click
  };

  return (
    <motion.div
      className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="grid"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <MenuDashbord activeItem={"User"} image={imagePath} />
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
        <div className="bg-gray-50">
          <motion.div
            className="flex  justify-between items-center py-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="md:text-2xl text-xl text-[#484848] font-bold md:ml-8 ml-6">
              My information
            </p>
            <div className="flex  items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-[65px] h-[65px] rounded-full border-2 border-orange-500 flex items-center overflow-hidden"
                onClick={handleClick}
              >
                {imagePath ? (
                  <img
                    src={imagePath}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  ""
                )}
              </motion.div>
              <button
                className="px-4 py-2 font-semibold text-[15px]"
                onClick={uploadImage}
              >
                Change Picture
              </button>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center mt-4 bg-gradient-to-r from-orange-300 to-orange-500"
          >
            <Geocoding />
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 mt-6 md:ml-8 ml-6 lg:mr-0 mr-4"
          >
            <div className="bg-inherit">
              {userData &&
                Object.keys(userData)
                  .filter((field) => field !== "profileImage") // Exclude profileImage field
                  .map((field) => (
                    <div key={field} className="mb-10">
                      <label className="text-[16px] capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="flex justify-between mt-1">
                        {field === "id" ? (
                          <span className="text-[#717171] text-[13px]">
                            {userData[field] || "Not provided"}
                          </span>
                        ) : editField === field ? (
                          <input
                            type="text"
                            className="border-none text-[#717171] text-[13px] bg-inherit px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={userData[field] || "Not provided"}
                            onChange={(event) => handleChange(event, field)}
                            onBlur={() => handleUpdate(field)}
                          />
                        ) : (
                          <>
                            <span className="text-[#717171] text-[13px]">
                              {userData[field] || "Not provided"}
                            </span>
                            <button
                              className="text-[#222222] text-[14px] underline font-semibold"
                              onClick={() => setEditField(field)}
                            >
                              {userData[field] ? "Edit" : "Add"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4 border border-[#DDDDDD] rounded-lg   mx-32 max-lg:hidden"
            >
              <div className="bg-inherit flex flex-col px-4 gap-4 py-4  ">
                <div>
                  <img src={secure} alt="" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[18px] font-bold">
                    Why isn't my info shown <br /> here?
                  </p>
                  <p className="text-[14px] text-[#717171]">
                    We are hiding some account details to <br />
                    protect your identity.
                  </p>
                </div>
              </div>
              <span className="h-[1px] w-[80%] bg-[#DDDDDD] ml-7"></span>
              <div className="bg-inherit flex flex-col px-4 gap-4 py-4  ">
                <div>
                  <img src={cle} alt="" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[18px] font-bold">
                    Which details can be edited?
                  </p>
                  <p className="text-[14px] leading-5 text-[#717171]">
                    Details Serbili uses to verify your <br /> identity can't be
                    cahnged.Contct info <br />
                    and some personal details can be <br />
                    edited,but we may ask you verify your <br /> identity the
                    next time you book or <br />
                    create a listing.
                  </p>
                </div>
                <span className="h-[1px] w-[90%] bg-[#DDDDDD] ml-3 mt-6 "></span>
              </div>
              <div className="bg-inherit flex flex-col px-4 gap-4 py-4  ">
                <div>
                  <img src={eye} alt="" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-[18px] font-bold">
                    What info is shared with <br />
                    others?
                  </p>
                  <p className="text-[14px] text-[#717171]">
                    Serbili only releases contact <br /> information for
                    costumers after <br />
                    the orders
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default User;
