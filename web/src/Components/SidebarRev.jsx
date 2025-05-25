import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/Context";
import account from "../assets/icons/account.svg";
import orders from "../assets/icons/orders.svg";
import notifaction from "../assets/icons/notification-bing.svg";
import logot from "../assets/icons/logout.svg";
import accountactive from "../assets/icons/accountactive.svg";
import ordersactive from "../assets/icons/Ordersactive.svg";
import notficationactive from "../assets/icons/notification-bing-svgrepo-com (1).svg";
import settings from "../assets/icons/setting-2.svg";
import help from "../assets/icons/info-circle.svg";
import { Avatar } from "flowbite-react";
import { Link } from "react-router-dom";
import api from "../utils/api";


const SidebarRev = ({ active }) => {
  const { userData, navigate, setUserData} = useContext(Context);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || "");

  // Fetch user profile image from the database
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await api.get("https://backendhost-production-1804.up.railway.app/dashboard/get-profile-image", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setProfileImage(response.data.profileImage);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, []);

  // Handle Image Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);

        try {
          await api.post("https://backendhost-production-1804.up.railway.app/dashboard/upload-profile-image", { imageBase64: base64Image }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          });
          setUserData({ ...userData, profileImage: base64Image });
        } catch (error) {
          console.error("Error saving image to database:", error);
        }
      };
    }
  };

  return (
    <div className="bg-gray-50 h-fit mt-10 rounded-xl">
      <div>
        {/* Profile Image Upload */}
        <div className="flex max-md:flex-col items-center mx-4 gap-4 mt-2 mb-8">
          <label htmlFor="profilePic" className="cursor-pointer">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover border" />
            ) : (
              <Avatar size="md" rounded />
            )}
          </label>
          <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <p className="md:text-[15px] text-xs font-medium">{userData?.firstname || "User"}</p>
        </div>

        {/* Sidebar Items */}
        {[
          { name: "Account", icon: accountactive, iconActive: account, href: "/revenue" },
          { name: "My Orders", icon: orders, iconActive: ordersactive, href: "/revenue/orders" },
          { name: "Notification", icon: notifaction, iconActive: notficationactive, href: "/revenue/notification" },
        ].map((item) => (
          <Link key={item.href} to={item.href}>
            <div className="mt-4 flex md:justify-normal justify-center items-center text-nowrap">
              <button className="mx-3 flex gap-3 px-2 py-1 rounded-xl">
                <img src={active === item.name ? item.iconActive : item.icon} alt={item.name} className="w-6 h-6" />
                <p className={`md:block hidden text-[15px] ${active === item.name ? "text-orange-500" : "text-[#9C939D]"}`}>
                  {item.name}
                </p>
              </button>
            </div>
          </Link>
        ))}

        <span className="h-[1px] bg-[#ccc] block mx-6 md:w-[80%] mt-16"></span>

        {/* Settings & Help */}
        {[
          { name: "Settings", icon: settings },
          { name: "Help", icon: help },
        ].map((item, index) => (
          <div key={index} className="flex md:justify-normal justify-center gap-3 mx-5 items-center mt-4">
            <img src={item.icon} alt={item.name} className="w-6 h-6" />
            <p className="text-[15px] md:block hidden text-[#9C939D]">{item.name}</p>
          </div>
        ))}

        {/* Logout */}
        <div className="flex justify-center items-center">
          <button
            className="flex gap-3 border border-gray-300 rounded-lg py-2 px-6 mx-4 mt-32 mb-4"
            onClick={async () => {
              const token = localStorage.getItem("accessToken");
              if (!token) {
                console.error("Access token is missing!");
                return;
              }
              try {
                await api.post("https://backendhost-production-1804.up.railway.app/auth/logout", {}, { headers: { Authorization: `Bearer ${token}`}, withCredentials: true });
                localStorage.removeItem("accessToken");
                navigate("/login");
              } catch (error) {
                console.error("Error during logout:", error.response?.data || error.message);
              }
            }}
          >
            <img src={logot} alt="Logout" className="w-6 h-6" />
            <p className="text-[14px] md:block hidden font-medium">Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarRev;
