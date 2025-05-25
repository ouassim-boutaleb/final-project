import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import SidebarRev from "../Components/SidebarRev";
import api from "../utils/api";

const Notfications = () => {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        //console.log(response.data.notifications);
        const notifications = response.data.notifications.map((notification) => {
          return {
            id: notification.id,
            message: notification.message,
            createdAt: new Date(notification.createdAt).toLocaleString(),
            isRead: notification.isRead,
            updatedAt: new Date(notification.updatedAt).toLocaleString(),

          };
        }
        );
        setNotifications(notifications);
        console.log(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    fetchNotifications();
      
  }
, []);
  return (
    <div>
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <div className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr] gap-6 mx-10">
        <SidebarRev active={"Notification"} />
        <div className="bg-[#FBFBFE] container px-4 pt-6 mt-10 max-h-screen rounded-lg">
          <p className="text-[20px] font-semibold">Notifications</p>
          <div className="flex flex-col gap-4 mt-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex justify-between items-center border-b-2 px-2 py-2 ${
                    notification.isRead ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {notification.createdAt}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm">No notifications available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notfications;
