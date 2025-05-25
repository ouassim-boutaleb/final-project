import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";
import CreateNewCode from "./pages/CreateNewPassword.jsx";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import User from "./pages/Dashbord/User";
import Settings from "./pages/Dashbord/Settings";
import Orders from "./pages/Dashbord/Orders";
import Products from "./pages/Products.jsx";
import Store from "./pages/Dashbord/Store.jsx";
import Main from "./pages/Dashbord/Main.jsx";
import Revenue from "./pages/Revenue.jsx";
import Cart from "./pages/Cart.jsx";
import Supliers from "./pages/Supliers.jsx";
import OrdersRev from "./pages/OrdersRev.jsx";
import Notfications from "./pages/Notfications.jsx";
import ManageProducts from "./pages/Dashbord/ManageProducts.jsx";
import Order from "./pages/Order.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Product from "./pages/Product.jsx";
import Notifications from "./pages/Dashbord/Notifications.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProtectedShop from "./Components/ProtectedShop.jsx";
import { ContextProvider } from "./context/Context.js";
import { useEffect } from "react";
import Admin from "./pages/Admin/Admin.jsx";
import ProtectedAdmin from "./Components/ProtecteAdmin.jsx";
import VerifyCode, { Otp } from "./pages/Verifycode.jsx";

function App() {
 
  useEffect(() => {
    
    
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <ContextProvider>
        
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verifyotp" element={<VerifyCode/>}/>
        <Route path = '/forgetpassword' element = {<ForgetPassword />} />
       
        
        
        <Route path="/order/:id" element={<ProtectedShop><Order/></ProtectedShop>}/>
        <Route path='/newpassword' element={<CreateNewCode/>}/>
        <Route path='/' element={<ProtectedShop><Home/></ProtectedShop>}/>
        <Route path="/supliers" element={<ProtectedShop><Supliers/></ProtectedShop>}/>
        <Route path='/revenue' element={<ProtectedShop><Revenue/></ProtectedShop>}/>
        <Route path="/revenue/orders" element={<ProtectedShop><OrdersRev/></ProtectedShop>}/>
        <Route path="/revenue/notification" element={<ProtectedShop><Notfications/></ProtectedShop>}/>
        <Route path="/cart" element={<ProtectedShop><Cart/></ProtectedShop>}/>
        <Route path="/products/:id" element={<ProtectedShop><Products/></ProtectedShop>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Main/></ProtectedRoute>}/>
        <Route path="/dashboard/userinformation" element={<ProtectedRoute><User/></ProtectedRoute>}/>
        <Route path="/dashboard/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
        <Route path="/dashboard/products" element={<ProtectedRoute><ManageProducts/></ProtectedRoute>}/>
        <Route path="/dashboard/store" element={<ProtectedRoute><Store/></ProtectedRoute>}/>
        <Route path="/dashboard/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
        <Route path="/product/:id" element={<ProtectedShop><Product/></ProtectedShop>}/>
        <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedShop><Checkout /></ProtectedShop>} />



        <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />
        <Route path="*" element={<Notfound />} />
      
      </Routes>
      
      </ContextProvider>
    </div>
  );
}

export default App;
