import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const VehicleForm = () => {
  const [vehicleData, setVehicleData] = useState({
    number: "",
    type: "",
    capacity: "",
    driver: "",
  });

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }
    try {
      // ✅ Use the API_URL variable
      const res = await axios.post(
        `${API_URL}/api/vehicles`,
        vehicleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setVehicleData({ number: "", type: "", capacity: "", driver: "" });
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert(err.response?.data?.message || "Failed to add vehicle");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="number" placeholder="Vehicle Number" value={vehicleData.number} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="text" name="type" placeholder="Vehicle Type (e.g., Lorry, Van)" value={vehicleData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="number" name="capacity" placeholder="Capacity (in tons)" value={vehicleData.capacity} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="text" name="driver" placeholder="Assigned Driver Name" value={vehicleData.driver} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" />
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md font-semibold">Save Vehicle</button>
      </form>
    </div>
  );
};

export default VehicleForm;
