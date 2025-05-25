import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import MenuDashbord from "../../Components/MenuDashbord";
import userImage from "../../assets/icons/userImage.avif";
import alertImage from "../../assets/icons/alert.png";
import { ThreeDot } from "react-loading-indicators";
import { motion, AnimatePresence } from "framer-motion";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("accessToken");
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    const getNotification = async () => {
      setLoading(true);
      try {
        const response = await api.get("https://backendhost-production-1804.up.railway.app/notifications", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data.notifications);
        setNotifications(response.data.notifications);
        setFilteredNotifications(response.data.notifications);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    getNotification();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `https://backendhost-production-1804.up.railway.app/notifications/mark-as-read/${notificationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // Update the notification state to mark it as read
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setFilteredNotifications(
      type === "All"
        ? notifications
        : notifications.filter((notification) => !notification.isRead)
    );
  }, [type]);

  return (
    <div className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr]">
      <MenuDashbord activeItem={"Notifications"} />
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
        <div className="py-5 px-6">
          <h3 className="text-2xl font-bold">Notifications</h3>
          {notifications && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex bg-orange-500 px-6 py-2 gap-4 text-white cursor-pointer">
                {["All", "Unread"].map((item, index) => (
                  <motion.h3
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={index}
                    className={`${item === type ? "underline" : ""}`}
                    onClick={() => setType(item)}
                  >
                    {item}
                  </motion.h3>
                ))}
              </div>

              {/* Animate notifications when switching filters */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="px-4 flex flex-col"
                >
                  {filteredNotifications.map((noti, index) => {
                    const createdAt = new Date(noti.createdAt);
                    const now = new Date();
                    const diffInMs = now - createdAt;
                    const diffInSec = Math.floor(diffInMs / 1000);
                    const diffInMin = Math.floor(diffInMs / (1000 * 60));
                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                    const diffInDays = Math.floor(
                      diffInMs / (1000 * 60 * 60 * 24)
                    );
                    const diffInMonths = Math.floor(
                      diffInMs / (1000 * 60 * 60 * 24 * 30)
                    );

                    let timeAgo;
                    if (diffInSec < 60) {
                      timeAgo = `${diffInSec}s ago`;
                    } else if (diffInMin < 60) {
                      timeAgo = `${diffInMin}min ago`;
                    } else if (diffInHours < 24) {
                      timeAgo = `${diffInHours}h ago`;
                    } else if (diffInDays < 30) {
                      timeAgo = `${diffInDays}d ago`;
                    } else if (diffInMonths < 12) {
                      timeAgo = `${diffInMonths}m ago`;
                    } else {
                      timeAgo = `More than a year`;
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        exit={{ opacity: 0, y: -30 }}
                        className={`py-6 last:border-none border-b-[1px] px-2 border-gray-300 flex justify-between items-center ${
                          !noti.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {!noti.isRead && (
                            <span className="w-[6px] h-[6px] rounded-full bg-blue-700"></span>
                          )}
                          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            <img
                              src={
                                noti.message.endsWith("left!")
                                  ? alertImage
                                  : noti?.shop?.profileImage || userImage
                              }
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div>
                            <h3>{`${
                              noti.message.endsWith("left!")
                                ? "Low Stock"
                                : noti?.shop?.firstname
                            }`}</h3>
                            <p>{noti.message}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-center">
                          <button onClick={() => {markAsRead(noti.id)}}>
                            read
                          </button>
                          <p className="text-sm text-gray-600">{timeAgo}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
