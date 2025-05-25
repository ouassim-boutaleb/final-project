import React, { useState } from "react";
import MenuDashbord from "../../Components/MenuDashbord";
import AddProduct from "../../Components/AddProduct";
import add from "../../assets/icons/add-svgrepo-com.svg";
import x from "../../assets/icons/delete-svgrepo-com.svg";
import Statistiques from "../../Components/Statistiques";
import { useEffect } from "react";
import api from "../../utils/api";


const ManageProducts = () => {
 
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("accessToken");
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await api.get("https://backendhost-production-1804.up.railway.app/products/warehouse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const salesResponse = await api.get("https://backendhost-production-1804.up.railway.app/dashboard/warehouse-product-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const salesData = salesResponse.data; // Ensure salesData contains product sales mapped by ID
        console.log("Sales data:", salesData);
  
        const updatedProducts = productsResponse.data.products.map((product, index) => ({
          ...product,
          sales: salesData[index]?.numberOfSells || 0, // Extract numberOfSells safely
        }));
  
        setProducts(updatedProducts);
        console.log("Products with sales data:", updatedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchProducts();
  }, []);
  
 

 
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  

  const addProductHandler = (newProduct) => {
    console.log("New/Updated Product:", newProduct);// the product object

    if (currentProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === currentProduct.productID
            ? {
                ...product,
                name: newProduct.productName,
                id: newProduct.productID,
                quantity: newProduct.stock,
                price: newProduct.price,
                description: newProduct.description,
                image: newProduct.productImage,
              }
            : product
        )
      );
    }else{
      //{window.location.reload()}
    }

    // if (currentProduct) {
    //   setProducts((prevProducts) =>
    //     prevProducts.map((product) =>
    //       product.id === currentProduct.productID
    //         ? {
    //             ...product,
    //             name: newProduct.productName,
    //             id: newProduct.productID,
    //             quantity: newProduct.stock,
    //             price: newProduct.price,
    //             description: newProduct.description,
    //             image: newProduct.productImage,
    //           }
    //         : product
    //     )
    //   );
    // }else{
    //   {window.location.reload()}
    // }

    // } else {
    //   setProducts((prevProducts) => [
    //     ...prevProducts,
    //     {
    //       name: newProduct.productName,
    //       id: newProduct.productID,
    //       quantity: newProduct.stock,
    //       price: newProduct.price,
    //       sales: 0,
    //       decline: 0,
    //       image: newProduct.productImage,
    //       description: newProduct.description,
    //     },
    //   ]);
    // }
    setShowAddProduct(false);
    setCurrentProduct(null);
  };

  const handleAddClick = () => {
    setCurrentProduct(null);
    setShowAddProduct(true);
  };

  const handleEditClick = (product) => {
    
    setCurrentProduct({
      productName: product.name,
      productID: product.id,
      stock: product.quantity,
      price: product.price,
      description: product.description,
      productImage: product.image,
    });
    setShowAddProduct(true);  
  };

  const handleClose = () => {
    setShowAddProduct(false);
    setCurrentProduct(null);
  };
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const confirmDelete = (e, id) => {
    e.stopPropagation(); // Prevent triggering handleEditClick
    setShowDeleteConfirmation(true);
    setCurrentProduct(products.find((product) => product.id === id));
    console.log("Product to delete:", products.find((product) => product.id === id));
    
  }; 

  const handleDeleteProduct = async (id) => {
    // setProducts((prevProducts) =>
    //   prevProducts.filter((product) => product.id !== id)
    // );
    
    
      try {
        const response = await api.delete(`https://backendhost-production-1804.up.railway.app/products/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      //  console.log(response.data);
        
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setShowDeleteConfirmation(false);
        setCurrentProduct(null);
        
       
        
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    
  };

const refreshTheToken = async () => {
  try{
  const response = await api.post("https://backendhost-production-1804.up.railway.app/auth/refresh-token",
    {},
 {withCredentials: true}// Include credentials in the request
);
console.log(response);
  }catch (error) {
    console.error("Failed to refresh token:", error);
    // Redirect to login if refresh fails
    window.location.href = "/login"; // Adjust the redirect URL as needed
  }
}
  
  return (
    <div className="grid md:grid-cols-[260px,1fr] grid-cols-[100px,1fr] relative">
      <div>
        <MenuDashbord activeItem={"Manage Products"} />
      </div>
      <div className={`p-8 ${showAddProduct ? "blur-sm" : ""} bg-gray-50`}>
        <div>
          <span className="text-[26px] font-semibold">Info</span>
          <Statistiques />
        </div>
        <h1 className="text-2xl font-bold mb-8 mt-8">Product Settings</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 mb-4">
          {products.map((product,index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg bg-gray-100 h-fit cursor-pointer relative"
              onClick={() =>{ handleEditClick(product)}}
            >
            <div className="w-6 h-6 bg-[#ff1c1c86] flex items-center justify-center rounded-full  absolute right-1 top-1 cursor-pointer z-50" onClick={(e) => {
                  confirmDelete(e, product.id);
                   // Prevent triggering handleEditClick
                  
                }} >
            <img
                src={x}
                className="w-5 "
                alt="delete"
                
              />
            </div>
              
              {product.image ? (
                <img
                  src={product.image}
                  alt={`${product.name}`}
                  className="w-full object-cover  rounded-xl h-[200px]"
                />
              ) : (
                <div className="h-[200px] bg-gray-500 flex items-center justify-center rounded-t-xl"></div>
              )}
              <div className="flex items-center justify-between text-[14px] mt-2 mx-2">
                <h3 className="font-bold">{product.name}</h3>
                <span className="text-[#A0A5BA]">id:{product.id}</span>
              </div>
              <div className="flex justify-between text-[13px] mx-2 mt-2">
                <p>Quantity</p>
                <span>{product.stock}</span>
              </div>
              <div className="flex justify-between text-[13px] mx-2 mt-1">
                <p>No sales</p>
                <span>{product.sales}</span>
              </div>
              <div className="flex justify-between text-[13px] mx-2 mt-1 mb-1">
                <p>Price</p>
                <span>{product.price} <span>DZ</span></span>
              </div>
            </div>
          ))}
          <div
            className="rounded-lg bg-gray-100 flex flex-col justify-center items-center cursor-pointer"
            onClick={handleAddClick}
          >
            <img src={add} className="w-20" alt="Add Product" />
            <span className="text-[#FF6F00] font-medium">ADD</span>
          </div>
        </div>
      </div>
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg">
            <AddProduct
              onAddProduct={addProductHandler}
              productToEdit={currentProduct}
              onClose={handleClose}
              id={currentProduct ? currentProduct.productID : null}
            />
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-[8px] shadow-lg p-4 max-w-sm w-full" style={{ borderRadius: "8px" }}>
            <h2 className="text-lg mb-4">{`Are you sure you want to delete ${currentProduct?.name}?`}</h2>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteProduct(currentProduct.id)}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ManageProducts;
