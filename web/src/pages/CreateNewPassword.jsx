import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import logo from "../assets/icons/logo2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateNewCode(props) {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    // email: Yup.string()
    //   .email("Invalid email format")
    //   .required("Email is required"),
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be a 6-digit number")
      .required("OTP code is required"),
    password: Yup.string()
      .matches(
       /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must be at least 8 characters including letters and numbers"
      )
      .required("Password is required"),
  });
const email = localStorage.getItem("email");
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("https://backendhost-production-1804.up.railway.app/auth/reset-password", {
        email: email,
        otp: values.otp,
        newPassword: values.password
      });
      console.log(values);
      if (response.status !== 200) {
        setErrors({ general: response.data.message || "Something went wrong" });
      } else {
        console.log("Password reset successful");
        localStorage.removeItem("email");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: error.response?.data?.message || "Network error. Please try again." });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex md:items-center py-16 md:py-0 justify-center h-screen px-[10px] sm:px-[1vw] md:px-[4vw] lg:px-[6vw] xl:px-[10vw] md:bg-white bg-[#FF6F00]">
      <div className="lg:py-10 flex lg:justify-between w-full md:justify-center md:items-center items-start lg:mx-20 mx:0 ">
        <div className="hidden lg:block text-[#727272] text">
          <h3 className="font-bold mb-2">Important Information</h3>
          <p className="mb-14">
            Please <span className="font-bold">read</span> the information below
            and then <br /> kindly <span className="font-bold">share</span> the
            requested information.
          </p>
          <ul className="list-disc ml-5">
            <li>Do not reveal your password to anybody</li>
            <li>Do not reuse passwords</li>
            <li>Use Alphanumeric passwords</li>
          </ul>
        </div>
        <div className="bg-[#FF6F00] lg:w-1/2 w-full px-2 md:px-20 md:py-20 py-4 lg:mx-0 mx-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl lg:text-4xl font-bold text-white">
              Create New <br /> Password
            </h3>
            <img
              src={logo}
              alt=""
              className="xl:w-[90px] w-[70px] lg:w-[75px]"
            />
          </div>
          <Formik
            initialValues={{ email: "", otp: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors }) => (
              <Form>
                {/* <label
                  htmlFor="email"
                  className="block text-white font-semibold mb-1"
                >
                  Email
                </label> */}
                {/* <Field
                  name="email"
                  type="email"
                  id="email"
                  className="block w-full py-2 rounded-xl border-[1px] border-black focus:outline-none px-2 mb-2 bg-white"
                /> */}
                {/* <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-900 mb-2"
                /> */}

                <label
                  htmlFor="otp"
                  className="block text-white font-semibold mb-1"
                >
                  OTP Code
                </label>
                <Field
                  name="otp"
                  type="text"
                  id="otp"
                  className="block w-full py-2 rounded-xl border-[1px] border-black focus:outline-none px-2 mb-2 bg-white"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-900 mb-2"
                />

                <label
                  htmlFor="password"
                  className="block text-white font-semibold mb-1"
                >
                  New Password
                </label>
                <Field
                  name="password"
                  type="password"
                  id="password"
                  className="block w-full py-2 rounded-xl border-[1px] border-black focus:outline-none px-2 mb-2 bg-white"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-900 mb-2"
                />

                {errors.general && (
                  <div className="text-red-900 mb-2">{errors.general}</div>
                )}

                <button
                  type="submit"
                  className="py-3 px-5 mt-6 bg-white text-[#FF6F00] font-medium rounded-md float-right"
                >
                  Continue
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreateNewCode;
