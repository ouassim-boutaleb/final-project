import React, { useState } from "react";
import axios from "axios";
import location from "../assets/icons/location.svg";

const Geocoding = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const accessToken =
      "pk.eyJ1Ijoic2VpZjIwMDUiLCJhIjoiY205cG90cGF3MHd4OTJqc2UwaGVzMmt0YiJ9.2PgEyxWHifROHS0zT7q5MQ";
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(endpoint);
      const data = response.data;

      if (data && data.features.length > 0) {
        const place = data.features[0];
        const geocodingData = {
          latitude: place.center[1], // Latitude
          longitude: place.center[0], // Longitude
          place_name: place.place_name, // Place name
         // radius: 20, // Example static radius
        };

        setResult(geocodingData);

        // Send data to the backend
        await axios.patch("https://backendhost-production-1804.up.railway.app/dashboard/profile", {
          latitude: geocodingData.latitude,
          longitude: geocodingData.longitude,
          address: geocodingData.place_name,
        }
, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
        );
        console.log("Data sent successfully!", geocodingData);
      } else {
        console.error("No results found.");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 bg-white rounded-sm sm:w-[670px] max-w-[620px] min-w-[300px] py-2">
        <img src={location} alt="location-icon" className="w-auto ml-6 mr-2" />
        <input
          type="text"
          placeholder="Enter a location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-none p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 mx-2 rounded-lg"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Geocoding;
