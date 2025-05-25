import X from "../assets/icons/Vector.svg";
import logo from "../assets/icons/logo.svg";
import dz from "../assets/icons/dz.svg";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ sidebarToggle, setSidebarToggle }) => {
  const navigate = useNavigate();

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {!sidebarToggle && (
        <motion.div
          className="fixed top-0 left-0 w-64 h-full bg-white z-50 border-r border-[#ccc]"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center ml-3 mr-6 py-[7px]">
            <div className="flex items-center gap-1">
              <img src={logo} alt="logo" />
              <span className="font-medium italic">serbili</span>
            </div>
            <button onClick={() => setSidebarToggle(true)}>
              <img src={X} alt="close" />
            </button>
          </div>
          <span className="h-[1px] w-full bg-[#ccc] block"></span>
          <motion.div className="flex justify-center items-center my-4"
          whileHover={{
           scale:1.1
          }}
          >
            <button
              className="bg-orange-500 text-white py-2 px-10 rounded-xl font-semibold"
              onClick={() => navigate("/")}
            >
              HOME
            </button>
          </motion.div>
          <span className="h-[0.5px] w-full bg-[#ccc] block"></span>
          <div className="flex flex-col">
            <p className="text-[#6A696E] text-[14px] mx-6 my-4">SECTIONS</p>
            <ul className="flex flex-col gap-4 mx-4 text-[20px] text-[#2E2C36] mb-4">
              {["My Account", "Suppliers", "My Orders"].map((item, index) => (
                <motion.li
                  key={index}
                  className="cursor-pointer w-full"
                  initial={{ backgroundColor: "transparent" }}
                  whileHover={{
                   x:10,
                    textDecoration: "underline", 
                    scale: 1.05, 
                  }}
                  animate={{
                   x:0,
                    textDecoration: "none",
                    scale: 1,
                  }} // Reset when unhovered
                  transition={{ duration: 0.3 }}
                  onClick={() =>
                    navigate(
                      item === "My Account"
                        ? "/revenue"
                        : item === "Suppliers"
                        ? "/supliers"
                        : "/orders"
                    )
                  }
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <span className="h-[1px] w-full bg-[#ccc] block"></span>
          <div className="flex flex-col">
            <p className="text-[#6A696E] text-[14px] mx-6 my-6">Other</p>
            <ul className="flex flex-col gap-8 mx-6 text-[14px] text-[#2E2C36] mb-4">
              <li className="cursor-pointer mt-2">Be a Warhouse</li>
              <li className="cursor-pointer">How to buy</li>
            </ul>
          </div>
          <span className="h-[1px] w-full bg-[#ccc] block mt-32"></span>
          <div className="flex items-center gap-5 mx-6 mt-6">
            <img
              src={dz}
              className="h-[32px] w-[32px] drop-shadow-lg"
              alt="flag"
            />
            <p className="text-[#2E2C36] text-[16px] font-bold">Algeria</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
