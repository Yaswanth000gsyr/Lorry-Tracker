import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const VehicleStatus = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }
    try {
      // ✅ Use the API_URL variable
      const vehicleRes = await axios.get(`${API_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vehicle = vehicleRes.data.find(v => v.number === vehicleNumber);
      if (!vehicle) {
        setError("Vehicle not found.");
        return;
      }
      
      const payload = { status };
      // ✅ Use the API_URL variable
      const updateRes = await axios.put(
        `${API_URL}/api/vehicles/${vehicle._id}/vehicle-status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateRes.status === 200) {
        setMessage("Vehicle status updated successfully!");
        setError("");
        setVehicleNumber("");
        setStatus("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || "Failed to update vehicle status.");
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Vehicle Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="w-full p-2 border rounded" required />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="under trip">Under Trip</option>
          <option value="under repair">Under Repair</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
        {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
        {error && <p className="text-center text-sm text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default VehicleStatus;
