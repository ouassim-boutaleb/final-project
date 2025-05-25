import React, { useContext, useEffect, useState, useCallback } from "react";
import MenuDashbord from "../../Components/MenuDashbord";
import Statistiques from "../../Components/Statistiques";
import api from "../../utils/api";
import { ThreeDot } from "react-loading-indicators";
import { motion } from "framer-motion";
import { Context } from "../../context/Context";

const Orders = () => {
  const [ordersdash, setOrdersDash] = useState([]);
  const { loading, setLoading } = useContext(Context);
  const [isShow, setIsShow] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const handleShowDetails = (order) => {
    setCurrentOrder(order);
    setIsShow(true);
    console.log("Current Order:", order);
  };

  const getOrders = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await api.get(
        "https://backendhost-production-1804.up.railway.app/order/my-orders-warehouse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Orders data:", response.data.orders);
      setOrdersDash(response.data.orders);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      getOrders();
    };
    fetchOrders();
  }, [getOrders]);

  const handleStatusChange = async (index, newStatus, id) => {
    const token = localStorage.getItem("accessToken");
    const updatedOrders = [...ordersdash];
    updatedOrders[index].status = newStatus;
    setOrdersDash(updatedOrders);

    try {
      await api.patch(
        `https://backendhost-production-1804.up.railway.app/tracking/${id}`,
        { status: newStatus.toUpperCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr]">
      <div>
        <MenuDashbord activeItem={"Orders"} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ThreeDot variant="bounce" color="#d1823d" size="large" />
        </div>
      ) : (
        <div className="bg-gray-50 p-4">
          <div className="flex flex-col mx-4">
            <p className="text-[26px] font-semibold">Info</p>
            <Statistiques />
          </div>

          <div className="bg-white mx-4 p-2">
            <p className="font-bold text-[18px] text-[#0C0C0C] mx-4">Orders</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-2">
              {ordersdash.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border cursor-pointer border-[#ccc] p-4 rounded shadow-md flex flex-col hover:scale-105 transition-transform duration-200"
                  onClick={() => handleShowDetails(order)}
                >
                  <div className="flex justify-between items-center mx-4">
                    <p className="text-xs text-[#9E9E9E]">Order ID - {order.id}</p>
                    <p className="text-xs font-medium">
                      Payment <span>:</span> <span className="text-gray-500">{order.paymentMethod}</span>
                    </p>
                  </div>

                  <p className="flex text-[14px] font-semibold gap-2 mx-8 my-4">
                    {order.orderItems.length} <span>items</span>
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-[14px] font-medium">
                        Order Price <span>:</span> {order.totalAmount}
                      </p>
                      <p className="text-[10px] text-[#B5B5B5]">
                        ORDER DATE <span>:</span> {new Date(order.updatedAt).toDateString()}
                      </p>
                    </div>
                    <div>
                      {['PENDING', 'SHIPPED'].includes(order.status) ? (
                        <motion.select
                          onClick={(e) => e.stopPropagation()}
                          value={order.status}
                          onChange={(e) => handleStatusChange(index, e.target.value, order.id)}
                          animate={{ opacity: [0, 1], scale: [0.95, 1] }}
                          transition={{ duration: 0.2 }}
                          className={`rounded-lg text-xs font-medium focus:border-none ${
                            order.status === "PENDING" ? "bg-[#D5C382] text-white" :
                            order.status === "SHIPPED" ? "bg-[#5B99B1] text-white" :
                            "bg-gray-500"
                          }`}
                        >
                          <option value="PENDING" className="bg-[#D5C382] text-white">pending</option>
                          <option value="SHIPPED" className="bg-[#5B99B1] text-white">shipping</option>
                        </motion.select>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`rounded-lg text-xs font-medium focus:border-none ${order.status === "CANCELED" ? "bg-red-500" : "bg-green-500"} py-2 px-[22px] text-white`}
                        >
                          {order.status}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isShow && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p className="capitalize">Name: {currentOrder.user?.lastname} {currentOrder.user?.firstname}</p>
            <p>Phone: {currentOrder.user?.phoneNumber}</p>
            {currentOrder.user?.emergencyContact && <p>Emergency: {currentOrder.user?.emergencyContact}</p>}
            <p>Address: {currentOrder.user?.address}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Products:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
                  currentOrder.orderItems.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center gap-3 border-b pb-2">
                      <img
                        src={item.product?.image || item.product?.images?.[0] || "/no-image.png"}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={e => { e.target.src = "/no-image.png"; }}
                      />
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">Price: {item.price}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No products found.</p>
                )}
              </div>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsShow(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
