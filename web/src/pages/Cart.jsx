import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import  card from '../assets/icons/card.png'
import { FaAngleLeft, FaAngleRight, FaRegTrashAlt } from 'react-icons/fa';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import api from '../utils/api';
import emptyCart from '../assets/images/emptyCart.webp'


import { Swiper, SwiperSlide } from 'swiper/react';
import '../App.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Context } from '../context/Context';
import { useContext } from 'react';
const Cart = () => {
    const [sidebarToggle,setSidebarToggle]=useState(true);
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem("accessToken");
    const {getCartItems, cartItems, setCartItems, similarProducts, warehouseId, setWarehouseId, fetchSimilar} = useContext(Context)
    useEffect(() => {
      fetchSimilar();
    }, [warehouseId]);
    useEffect(() => {
      getCartItems();

    },[])

   
    // Add quantity property to products
    
    
    // const [cartItems, setCartItems]=useState([
    //   {
    //     id: 1,
    //     name: 'Product 1',
    //     price: 29.99,
    //     image: 'https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg',
    //     quantity: 1,
    //     color: 'Red',
    //     size: 'M',
    //     orders: 2,
    //     seller: 'Seller 1',
    //     rating: 4.5,
    //     stock: 10,
    //   },
    //   {
    //     id: 2,
    //     stock: 10,
    //     name: 'Product 2',
    //     price: 29.99,
    //     seller: 'Seller 1',
    //     image: 'https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg',
    //     quantity: 1,
    //     color: 'Red',
    //     size: 'M',
    //     orders: 2,
    //     rating: 4.5,
    //   },
    //   {
    //     id: 3,
    //     stock: 10,
    //     seller: 'Seller 1',
    //     name: 'Product 2',
    //     price: 29.99,
    //     image: 'https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg',
    //     quantity: 1,
    //     color: 'Red',
    //     size: 'M',
    //     orders: 2,
    //     rating: 4.5,
    //   },
    //   {
    //     id: 4,
    //     stock: 10,
    //     sellere: 'Seller 1',
    //     name: 'Product 2',
    //     price: 29.99,
    //     image: 'https://www.energysistem.com/cdnassets/products/45305/principal_2000.jpg',
    //     quantity: 1,
    //     color: 'Red',
    //     size: 'M',
    //     orders: 2,
    //     rating: 4.5,
    //   },
    // ])
    const Shipping = (cartItems.length > 0)? 500 :0;
    //add quantity
    const addQuantity = (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === itemId ? { ...item, quantity: item.quantity+1 } : item
        )
      );
      const quantity = cartItems.filter((item)=> item.product.id === itemId)[0].quantity+1;

      console.log(quantity)
      updateCart(itemId, quantity );
    }
    //reduce quantity
    const reduceQuantity = (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === itemId ? { ...item, quantity: item.quantity-1 } : item
        )
      );
      setCartItems((prevItems) => prevItems.filter((item) => item.quantity > 0));

      const quantity = cartItems.filter((item)=> item.product.id === itemId)[0].quantity-1;

      
      updateCart(itemId, quantity);
    }

    //remove items
    const removeItem = async (cartItemId) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== cartItemId));
      const token = localStorage.getItem("accessToken");
      try{
        const response = await api.delete(`https://backendhost-production-1804.up.railway.app/cart/${cartItemId}`,{
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        },)
        }catch(err){
          console.log(err)
        }
    }
    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);


    const handleSwiperUpdate = (swiper) => {
      // Disable "Previous" button if on the first slide
      if (swiper.isBeginning) {
        document.querySelector('.prev').classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        document.querySelector('.prev').classList.remove('opacity-50', 'cursor-not-allowed');
      }
  
      // Disable "Next" button if on the last slide
      if (swiper.isEnd) {
        document.querySelector('.next').classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        document.querySelector('.next').classList.remove('opacity-50', 'cursor-not-allowed');
      }
    };

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    React.useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [screenWidth]);

    const formatNumber = (number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 2,
      }).format(number);
    };

    const updateCart = async (cartItemId, quantity)=> {
      const token = localStorage.getItem("accessToken");
      const response = api.patch(`https://backendhost-production-1804.up.railway.app/cart/${cartItemId}`,{
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
    }




  return (
    <div>
      <Sidebar sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        />
    <Navbar 
      sidebarToggle={sidebarToggle}
      setSidebarToggle={setSidebarToggle} />
      { cartItems.length > 0 ?
      <div className='container mx-auto mt-10 pb-10'>
        <div className='grid lg:grid-cols-3 grid-cols-1  w-full lg:gap-x-8 gap-y-4 lg:gap-y-0'>
          <div className='col-span-2 border-[1px]  rounded-lg p-4 h-fit'>
            <h3>Items Name</h3>
            <div className='flex flex-col gap-4'>
              {cartItems.map((item, index) => (
                <div key={index} className='flex items-center justify-between border-b-[1px] last:border-none py-4 pr-3'>
                  <div className='flex items-center gap-4'>
                    <div className='border-[2px] border-black rounded-md overflow-hidden w-16 h-16'>
                      <img src={item.product.image} alt={item.product.name} className=' object-cover ' />
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                      <h3>{item.product.name}</h3>
                      <h6 className='text-[#FF6F00] text-sm'>{formatNumber(item.product.price)}DZD</h6>
                    </div>
                  </div>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3 bg-gray-100  rounded-full'>
                      <button className='w-5 h-5 rounded-full bg-white flex items-center justify-center ml-1 my-1' onClick={()=> item.quantity > 1 ? reduceQuantity(item.product.id): removeItem(item.product.id)}>
                        {item.quantity > 1 ? '-' : <FaRegTrashAlt size={12} />}
                      </button>

                      <span className='text-sm'>{formatNumber(item.quantity)}</span>
                      <button className='w-6 h-6 rounded-full bg-[#FF6F00] flex items-center justify-center text-white' onClick={()=> addQuantity(item.product.id)}>
                        +
                      </button>
                    </div>
                    <button className='text-[#FF6F00] cursor-pointer text-sm' onClick={()=>removeItem(item.product.id)}>remove</button>
                    <h3 className='text-gray-800'>{formatNumber(item.quantity * item.product.price)}DZD</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='col-span-1 border-[1px] rounded-lg p-4 px-8 h-fit w-full'>
              <h3 className='font-semibold'>Order Summary</h3>
              <div className='flex items-center justify-between pt-4 text-sm pl-4 '>
                <h3>items total</h3>
                <h3 className='text-gray-700'>{formatNumber(totalPrice)} DZD</h3>
              </div>
              <div className='flex items-center justify-between border-b-[1px] py-4 text-sm pl-4'>
                <h3>delivery fee</h3>
                <h3 className='text-gray-700'>{formatNumber(Shipping)} DZD</h3>
              </div>
              <div className='py-4 flex items-center justify-between'>
                <h3 className='font-semibold'>Total</h3>
                <h3 className='text-gray-700 '>{formatNumber(totalPrice + Shipping)} DZD</h3>
              </div>
              <button className={`w-full bg-[#FF6F00] text-white  font-semibold rounded-3xl items-center  flex px-4 py-3 ${screenWidth < 1280 ? 'justify-center' : 'justify-between'}`} onClick={()=> window.location.href='/checkout'}>
                <div className='flex items-center' >
                  <img src={card} alt="" />
                  <span className='ml-2 text-sm '>Checkout</span>
                </div>
                {
                  screenWidth < 1280 ? null :
                <h3 className='text-sm'>{formatNumber(totalPrice + Shipping)} DZD</h3>

              }
              </button>
          </div>
          
        </div>

        {/* recomendation section */}

        <div className='mt-10'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='font-semibold'>Recommandations</h3>
            <div className='flex items-center gap-4'>
              <button className='prev h-10 w-10 rounded-full flex items-center justify-center border-[1px] border-gray-300'>
                <FaAngleLeft size={18} />
              </button>

              <button className='next h-10 w-10 rounded-full flex items-center justify-center border-[1px] border-gray-300'> 
                <FaAngleRight size={18} />
              </button>
            </div>
          </div>
          {similarProducts.length > 0 && (
          <Swiper
              modules={[Navigation,  A11y]}
              spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 5,
                },
              }}
              navigation={
                {
                  prevEl:'.prev',
                  nextEl:'.next'
                }
              }
              pagination={{ clickable: true }}
              
              onInit={(swiper) => {
                handleSwiperUpdate(swiper);
              }}
              onSlideChange={(swiper) => {
                handleSwiperUpdate(swiper);
              }}
              >

          <div className='grid grid-cols-4 gap-4 mt-4 w-full '>
            
            {similarProducts.map((item, index) => (
              <SwiperSlide key={index} className='flex w-full'> 
              <div  className='border-[1px] rounded-lg p-4 cursor-pointer' onClick={()=> window.location.href=`/product/${item.id}`}>
                <img src={item.image} alt={item.name} className='w-full h-36 rounded-md' />
                <h3 className='text-sm font-semibold mt-2'>{item.name}</h3>
                <h6 className='text-black text-sm mt-2'>{formatNumber(item.price)}DZD</h6>
                <h6 className='text sm mt-2 text-[#FF6F00]'>{formatNumber(item.stock)} Left</h6>
              </div>
              </SwiperSlide>
            ))}
            
            

            
          </div>
          </Swiper>
          )}
      </div>
      </div>
      :
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center justify-center gap-6 p-10 border border-gray-100">
          <img src={emptyCart} alt="Empty Cart" className="w-40 h-40 object-contain mb-4 opacity-80" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center mb-4">Looks like you haven&apos;t added anything to your cart yet.</p>
          <button
            className="bg-[#FF6F00] hover:bg-[#e65c00] text-white font-semibold px-6 py-2 rounded-full transition duration-200"
            onClick={() => window.location.href = '/supliers'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
  }
    </div>
  )
}

export default Cart