import logo from "../assets/icons/logo.jpg";
import image from "../assets/images/Login-amico.png";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { motion } from "motion/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const validationSchema = Yup.object({
    number: Yup.string()
      .matches(/^(05|06|07)\d{8}$/, "phone number is not valid")
      .required("Phone Number is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must be at least 8 characters including letters and numbers "
      )
      .required("password is required"),
  });
  const formik = useFormik({
    initialValues: {
      number: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        identifier: values.number,
        password: values.password,
      };
      try {
        const response = await axios.post(
          "https://backendhost-production-1804.up.railway.app/auth/login",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        const message = response.data.message
       localStorage.setItem("accessToken", response.data.accessToken);
       
               localStorage.setItem("user", JSON.stringify(response.data.user));
       
               toast.success(message, {
                 position: "top-right",
                 autoClose: 3000,
                 hideProgressBar: true,
               });
       
               setTimeout(() => {
                 navigate("/");
               }, 3000);
      } catch (error) {
              console.log(error.response.data.msg);
              const message = error.response.data.msg
              setError("Login failed , please try again.");
              toast.error(`${message}, please try again` , {
                position: "top-right",
                autoClose: 3000,
              });
              setTimeout(() => {
                setError("");
              }, 3000);
            }
    },
  });

  const handleblur = (e) => {
    if(e.target.value.length>0){
    e.target.classList.add("blure");
    }else{
      e.target.classList.remove("blure")
    }
    
    formik.handleBlur(e);
  };

  return (
    <motion.div
    initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        ease: "easeOut",
        duration: 0.8,
      }}
     className="container flex  2xl:gap-0  w-screen ">
         <ToastContainer />
      <div className="flex  justify-center  items-center 2xl:justify-between lg:gap-24 lg:ml-16 lg:mr-16 2xl:mr-0  lg:w-1/2 w-full">
        <div className="">
          <div className="flex flex-col lg:w-[350px]  w-[375px]  ">
            <motion.div
              initial={{
                y: -50,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }} 
            className="flex flex-col  lg:mt-12 mt-16 mb-6 ">
              <div className="lg:text-4xl text-3xl  tracking-[6px] ">
                <h2>WELCOME </h2>
                <div className="border-t-4 border-orange-500 lg:w-[180px] w-[160px] mt-2"></div>
              </div>
              <div className="lg:text-4xl lg:mx-48 mx-[165px] text-3xl  tracking-[6px] ">
                <h2>BACK!</h2>
                <div className="border-t-4 border-orange-500 lg:w-[122px] w-[105px] mt-2"></div>
              </div>
            </motion.div>
            <motion.form
            initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              onSubmit={formik.handleSubmit}
              className="flex flex-col lg:max-w-[397px]  max-w-full"
            >
              <div className="relative number h-10 input">
                <input
                  className=" border-2 focus:border-none border-gray-300 rounded-xl p-2 mt-10 bg-transparent w-full h-full absolute bottom-0"
                  type="text"
                  name="number"
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  onBlur={handleblur}
                />
                <label
                  htmlFor="number"
                  className="absolute text-gray-400 top-[50%] translate-y-[-50%] left-2 pointer-events-none"
                >
                  Phone Number
                </label>
              </div>

              {formik.touched.number && formik.errors.number ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.number}
                </div>
              ) : null}
              
              <div className="h-10 password relative input mt-4">
                <input
                  className=" border-2 focus:border-none border-gray-300  rounded-xl p-2 mt-6 w-full absolute bottom-0"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={handleblur}
                />
                <label
                  htmlFor="password"
                  className="absolute text-gray-400 top-[50%] translate-y-[-50%] left-2 pointer-events-none"
                >
                  Password
                </label>
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
              <div className="text-red-500 text-sm mt-1">
                  {error}
                </div>
              <Link
                to="/forgetpassword"
                className="text-[#1E4AE9] flex justify-end mt-4"
              >
                Forgot Password?
              </Link>

              <button
                type="submit"
                className={`mt-4 text-base font-small text-white  h-[45px] rounded-xl w-full ${formik.isSubmitting ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500'}`}
              >
                Sign in
              </button>
            </motion.form>
           
            
            <motion.div
             initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }} 
            className="flex justify-center items-center lg:mt-4 mt-6">
              <p className="text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#1E4AE9]">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 ">
          <div className="lg:flex flex-col items-center hidden">
            <motion.div 
            initial={{
                y: -50,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.7,
              }}
            className="bg-orange-500 w-[4.5px] h-[250px]"></motion.div>
            <motion.img
             initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
             src={logo} className="max-w-[129px]  " alt="" />
            <motion.div 
             initial={{
                y: 50,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.7,
              }}
            className="bg-orange-500 w-[4.5px] h-[250px]"></motion.div>
          </div>
        </div>
      </div>
      <motion.div
       initial={{
          scale: 0.4,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
       className="lg:flex justify-center items-center w-1/2 hidden">
        <img src={image} className="w-[500px] " alt="" />
      </motion.div>
    </motion.div>
  );
}