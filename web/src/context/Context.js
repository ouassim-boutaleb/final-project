import {  createContext, useState  } from "react";

import api from "../utils/api";
import { useNavigate } from "react-router-dom";
export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [image, setImage] = useState(null);
    const [warehouseId, setWarehouseId] = useState(null);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const getImage = async()=> {
        try{
            const response = await api.get("https://backendhost-production-1804.up.railway.app/dashboard/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
            )
            setImage(response.data.user.profileImage);
           // console.log(image);
           // console.log(response.data.user.profileImage)
        }catch(err){
            console.log("err: ", err)
        }
    }
    const  fetchUserData = async () => {
        const token = localStorage.getItem("accessToken");
        try {
          const response = await api.get("https://backendhost-production-1804.up.railway.app/dashboard/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data.user);
          setLoading(false); 
          console.log(response.data.user)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
       
      }
      const logout = async ()=> {
        const token = localStorage.getItem("accessToken");
        try{
        const response = await api.post("https://backendhost-production-1804.up.railway.app/auth/logout",{},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        localStorage.removeItem("accessToken");
        window.location.reload();
        }catch(err ){
          console.log("err: ", err)
        }
      }

    const [cartItems, setCartItems] = useState([]);
        const getCartItems = async ()=> {
          const token = localStorage.getItem("accessToken");
          const userId = JSON.parse(localStorage.getItem("user")).id;
          try {
            const response = await api.get(`/cart`,{
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
            const something = response.data.cart.cartItems;
            setWarehouseId(something[0].product.warehouseId);
            
          console.log(something)
            setCartItems(something);
          console.log(cartItems);
            
            
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        } 
        const [similarProducts, setSimilarProducts] = useState([]);
        const fetchSimilar = async () => {
              try {
                const response = await api.get(`/products/warehouse/${warehouseId}`,{
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }, 
                  withCredentials: true,
                });
                setSimilarProducts(response.data.products);
                console.log("similar products", response.data.products);
                
              } catch (error) {
                console.error("Error fetching products:", error);
              }
            };
        

    return (
        <Context.Provider value={{image, getImage, getCartItems, cartItems, setCartItems,similarProducts, userData,setUserData, fetchUserData, logout,token, fetchSimilar, loading, setLoading,navigate, warehouseId, setWarehouseId}}>
            {children}
        </Context.Provider>
    );
}







