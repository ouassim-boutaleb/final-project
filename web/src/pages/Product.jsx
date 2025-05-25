import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { FaStar } from "react-icons/fa";
import api from "../utils/api";
import { Context } from "../context/Context";
import { useContext } from "react";
import { EventsLoader } from "../Components/Skeleton";

function Product(props) {
  const [product, setProduct] = useState({});
  const [sidebarToggle, setSidebarToggle] = useState(true);


  const productId = window.location.pathname.split("/")[2];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await api.get(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(productId);
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const getUserRating = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await api.get(`/productReviews/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.rating) {
          setExistingRating(response.data.rating);
          setRating(response.data.rating);
          //console.log("Existing rating:", response.data.rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    getProduct();
    getUserRating();
  }, [productId]);

  const [quantity, setQuantity] = useState(10);
  
  const { warehouseId } = useContext(Context);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = JSON.parse(localStorage.getItem("user")).id;
    try {
      const response = await api.post(
        "/cart",
        {
          productId: product.id,
          quantity: quantity,
          userId: userId,
          color: "red",
          size: "M",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    window.history.back();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState();
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating);
    }
  }, [existingRating]);
  const validateInput = (event) => {
    const value = event.target.value.trim();
    const regex = /^(?:[1-4](?:\.\d+)?|5(?:\.0+)?)$/;

    if (!value) {
      setMessage("Rating must be between 1 and 5.");
    } else if (!regex.test(value)) {
      setMessage("Enter a float between 1 and 5.");
    } else {
      setMessage("");
      setRating(value);
    }
  };

  const [warehouseRating, setWarehouseRating] = useState();
  const [existingWarehouseRating, setExistingWarehouseRating] = useState(null);
  const [warehouseMessage, setWarehouseMessage] = useState("");

  // Fetch existing warehouse rating
  useEffect(() => {
    const getWarehouseRating = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await api.get(
          `/warehouseReviews/${product.warehouseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.rating) {
          setExistingWarehouseRating(response.data.rating);
          setWarehouseRating(response.data.rating);
        }
      } catch (error) {
        console.error("Error fetching warehouse rating:", error);
      }
    };

    if (product.warehouseId) {
      getWarehouseRating();
    }
  }, [product.warehouseId]);

  // Validate warehouse rating input
  const validateWarehouseInput = (event) => {
    const value = event.target.value.trim();
    const regex = /^(?:[1-4](?:\.\d+)?|5(?:\.0+)?)$/;

    if (!value) {
      setWarehouseMessage("Rating must be between 1 and 5.");
    } else if (!regex.test(value)) {
      setWarehouseMessage("Enter a float between 1 and 5.");
    } else {
      setWarehouseMessage("");
      setWarehouseRating(value);
    }
  };
  // Submit warehouse rating
  /*const sendWarehouseRating = async () => {
    const token = localStorage.getItem("accessToken");

    if (!warehouseRating) {
      setWarehouseMessage("Please enter a valid rating before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `/warehouseReviews/${product.warehouseId}`, // Endpoint for submitting the rating
        {
          rating: warehouseRating, // The rating value
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      console.log("Warehouse rating submitted successfully:", response.data);
      setWarehouseMessage("Rating sent successfully!");

      // Optionally reload the page or update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting warehouse rating:", error);
      setWarehouseMessage(
        "Failed to submit rating. Please check your network and try again."
      );
    }
  };
  // Handle warehouse rating submission
  const handleWarehouseRatingSubmission = async () => {
    await sendWarehouseRating();
  };*/
  const sendWarehouseRating = async () => {
    const token = localStorage.getItem("accessToken");

    if (!warehouseRating) {
      setWarehouseMessage("Please enter a valid rating before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `/warehouseReviews/${product.warehouseId}`, // Endpoint for submitting the rating
        {
          rating: warehouseRating, // The rating value
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      console.log("Warehouse rating submitted successfully:", response.data);
      setWarehouseMessage("Rating sent successfully!");
      setExistingWarehouseRating(warehouseRating); // Update the existing warehouse rating state

      // Optionally reload the page or update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting warehouse rating:", error);

      // Check if the error is due to an existing rating
      if (error.response && error.response.status === 400) {
        try {
          // Update the existing warehouse rating
          const updateResponse = await api.patch(
            `/warehouseReviews/${product.warehouseId}`, // Endpoint for updating the rating
            {
              rating: warehouseRating, // The updated rating value
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Authorization header
              },
            }
          );

          console.log(
            "Warehouse rating updated successfully:",
            updateResponse.data
          );
          setWarehouseMessage("Rating updated successfully!");
          setExistingWarehouseRating(warehouseRating); // Update the existing warehouse rating state

          // Optionally reload the page or update the UI
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (updateError) {
          console.error("Error updating warehouse rating:", updateError);
          setWarehouseMessage(
            "Failed to update rating. Please check your network and try again."
          );
        }
      } else {
        setWarehouseMessage(
          "Failed to submit rating. Please check your network and try again."
        );
      }
    }
  };

  const handleWarehouseRatingSubmission = async () => {
    await sendWarehouseRating();
  };
  const sendProductRating = async () => {
    const token = localStorage.getItem("accessToken");

    if (!rating) {
      setMessage("Please enter a valid rating before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `/productReviews/${productId}`, // Endpoint for submitting the rating
        {
          rating: rating, // The rating value
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      console.log("Product rating submitted successfully:", response.data);
      setMessage("Rating sent successfully!");
      setExistingRating(rating); // Update the existing rating state

      // Optionally reload the page or update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting product rating:", error);

      // Check if the error is due to an existing rating
      if (error.response && error.response.status === 400) {
        try {
          // Update the existing rating
          const updateResponse = await api.patch(
            `/productReviews/${productId}`, // Endpoint for updating the rating
            {
              rating: rating, // The updated rating value
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Authorization header
              },
            }
          );

          console.log(
            "Product rating updated successfully:",
            updateResponse.data
          );
          setMessage("Rating updated successfully!");
          setExistingRating(rating); // Update the existing rating state

          // Optionally reload the page or update the UI
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (updateError) {
          console.error("Error updating product rating:", updateError);
          setMessage(
            "Failed to update rating. Please check your network and try again."
          );
        }
      } else {
        setMessage(
          "Failed to submit rating. Please check your network and try again."
        );
      }
    }
  };
  // Handle warehouse rating submission
  const handlRatingSubmission = async () => {
    await sendProductRating();
  };

  return (
    <div>
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <Navbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />

      <div className="container">
        {loading ? (
          <EventsLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
            <div className="col-span-1 ">
              <div className="max-w-[500px] max-h-[450px] border-[2px] border-black rounded-lg overflow-hidden ">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="col-span-1 ">
              <h3 className="font-semibold text-xl mb-3">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{product.price} DZD</h3>
                <div className="flex items-center gap-5">
                  <p className="text-sm text-gray-700">{product.solds} solds</p>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {product.rating}
                  </span>
                </div>
              </div>
              <div>
                {/* description */}

                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-gray-700 max-w-[80%] text-sm mt-2 mb-3">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-10 mb-6">
                  <h3 className="font-medium">Seller:</h3>
                  <p>{product.seller}</p>
                </div>

                <div>
                  <h3 className="font-medium">
                    Stock:{" "}
                    <span className="font-normal">{product.stock} item(s)</span>
                  </h3>
                  <p className="text-xs text-gray-700 mt-4">
                    You can't Buy under 10 Items
                  </p>
                  <div className="mt-4 flex items-center">
                    <button
                      className="bg-gray-100 w-5 h-5 flex items-center justify-center"
                      onClick={() =>
                        quantity === 10
                          ? setQuantity(10)
                          : setQuantity(quantity - 1)
                      }
                    >
                      -
                    </button>
                    <button className="px-3">{quantity}</button>
                    <button
                      className="bg-gray-100 w-5 h-5 flex items-center justify-center"
                      onClick={() =>
                        quantity === product.stock
                          ? setQuantity(product.stock)
                          : setQuantity(quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-white py-2 px-4 bg-[#FF6F00] text-sm mt-8 "
                    onClick={handleAddToCart}
                  >
                    Add To Cart
                  </button>
                </div>
                <div className="flex justify-end items-end flex-col">
                  <p className="text-gray-600 font-semibold text-xs mr-8">
                    Rate the product:
                  </p>
                  <div className="flex items-end justify-end gap-2">
                    <input
                      type="text"
                      placeholder="./5"
                      className="border-gray-500 py-[2px]  focus:border-gray-100  w-1/4"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      onBlur={validateInput}
                    />
                    <button
                      className="text-white py-1 px-2 rounded-md bg-[#FF6F00] text-xs mt-4"
                      onClick={handlRatingSubmission}
                      disabled={message !== ""}
                    >
                      {existingRating ? "Edit Rating" : "Submit Rating"}
                    </button>
                  </div>
                  {message && <p className="text-red-500 text-xs">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center mt-16 mb-10 justify-center gap-2">
        <p className="font-semibold text-xs text-gray-500">
          Rate the supplier of this product:
        </p>

        <input
          type="text"
          placeholder="./5"
          className="border-gray-500 py-[2px] focus:border-gray-100  w-1/12"
          value={warehouseRating}
          onChange={(event) => setWarehouseRating(event.target.value)}
          onBlur={validateWarehouseInput}
        />
        <button
          className="text-white py-1 px-2 rounded-md bg-[#FF6F00] text-xs"
          onClick={handleWarehouseRatingSubmission}
          disabled={warehouseMessage !== ""}
        >
          {existingWarehouseRating ? "Edit Rating" : "Submit Rating"}
        </button>
        {warehouseMessage && (
          <p className="text-red-500 text-xs">{warehouseMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Product;
