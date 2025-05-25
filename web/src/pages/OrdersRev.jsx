import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import SidebarRev from '../Components/SidebarRev'
import {useNavigate} from 'react-router-dom'
import api from '../utils/api'

const OrdersRev = () => {
  const navigate = useNavigate()
     const[sidebarToggle,setSidebarToggle]=useState(true)
     
     const navigation = ["All","Pending", "Shipped", "Delivered", "Canceled"]
     const [active, setActive] = useState("All")
    //  const [orders, setOrders] = useState([
    //   {id: 1, status: "Pending", date: "2023-10-01", total: 100, paymentMethod: "Credit Card", cartItems:[{id: 1, name: "product 1", price: 50, quantiy: 2, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"},{id: 2, name: "product 2", price: 50, quantiy: 1, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"}]},
    //   {id: 2, status: "In Progress", date: "2023-10-02", total: 200, paymentMethod: "PayPal", cartItems:[{id: 1, name: "product 1", price: 50, quantiy: 2, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"},{id: 2, name: "product 2", price: 50, quantiy: 1, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"}]},
    //   {id: 3, status: "Completed", date: "2023-10-03", total: 300, paymentMethod: "Bank Transfer", cartItems:[{id: 1, name: "product 1", price: 50, quantiy: 2, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"},{id: 2, name: "product 2", price: 50, quantiy: 1, image: "https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg"}]},
    //  ])
    const [orders, setOrders]= useState([]);
    useEffect(()=> {
      const token = localStorage.getItem("accessToken")
      const getOrders = async ()=> {
        try{
          const response = await api.get("https://backendhost-production-1804.up.railway.app/order/my-orders",{
            headers:{
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          console.log(response.data.orders);
          setOrders(response.data.orders);
          
        }catch(err){
          console.log(err);
        }
      }
      getOrders();
    },[])
    

     const [filtered, setFiltered] = useState(orders)
     useEffect(()=> {
        if(active !== 'All'){
          setFiltered(orders.filter((item)=> item.status.toUpperCase() === active.toUpperCase()))
        }else{
          
          setFiltered(orders)
        }
     },[active,orders])

     function style(status){
      if(status === "Completed") {
        return "text-green-500 border-green-500 bg-green-50"
            } else if (status === "PENDING") {
        return "text-yellow-500 border-yellow-500 bg-yellow-50"
            } else if (status === "SHIPPED") {
        return "text-blue-500 border-blue-500 bg-blue-50"
            } else if (status === "CANCELED") {
        return "text-red-500 border-red-500 bg-red-50"
            } else {
        return "text-green-500 border-green-500 bg-green-50"
      }
     }
  return (
    <div >
    <Sidebar sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        />
    <Navbar 
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle} />
      <div className='grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr] gap-6 mx-10'>
       <SidebarRev active={"My Orders"}/>


       <div className='px-10 shadow-md rounded-lg bg-white mt-10 py-4'>
          <h3>My Orders</h3>
          {/* navigation */}
          <div className=' flex items-center gap-2 mt-4 mb-4'>
            {navigation.map((item, index)=>(
              <button key={index} className={`text-xs font-regular px-2 py-2 rounded-lg border-[1px] bg-gray-50 ${active === item ? "text-[#FF6F00] border-[#FF6F00]" : " text-gray-700"}`} onClick={()=>setActive(item)}>{item}</button>
            ))}
          </div>

          {/* orders */}

          <div>
            {filtered.map((order, index)=>(
              <div key={index} className='border-[1px] border-gray-200 rounded-lg p-4 mb-4 ' onClick={()=>navigate(`/order/${order.id}`)}>
                {/* top part */}
                <div className='flex items-center justify-between flex-wrap'> 
                  <div className='w-[200px] mb-2'>
                    <h3 className='font-medium'>Order {order.status}</h3>
                    <p className='text-xs text-gray-500 mt-1'>{order.date}</p>
                  </div>
                  <div className='w-[200px] mb-2'>
                    <h3 className='text-[#FF6F00]'>${order.totalAmount}</h3>
                    <p className='text-xs text-gray-500 mt-1'>Payed With{order.paymentMethod}</p>
                  </div>
                  <div className='w-[200px]'>
                    <h3>items</h3>
                    <p className='text-xs text-gray-500 mt-1'> X{order.orderItems.length}</p>
                  </div>
                  <div className='w-[200px]'>
                    <h3 className={`${style(order.status)} border-[1px] rounded-full px-3 py-2 w-fit text-sm`}>{order.status}</h3>
                  </div>
                </div>
                {/* bottom part */}
                <div className='flex items-center gap-4 mt-4'>
                  {order.orderItems.map((item, index)=>(
                    
                      <div className='w-14 h-14 rounded-lg overflow-hidden border-[1px] border-black' key={index}>
                        <img src={item.product.image} alt="" className='h-full w-full' />
                      </div>
                    
                  ))}
                </div>
              </div>
            ))}
          </div>
       </div>
      </div>
    </div>
  )
}

export default OrdersRev
