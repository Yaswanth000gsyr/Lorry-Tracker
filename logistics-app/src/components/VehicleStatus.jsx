import React, { useState } from "react";
import axios from "axios";

const VehicleStatus = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
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
    // Step 1: Get all vehicles
    const vehicleRes = await axios.get("http://localhost:5000/api/vehicles", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const vehicles = vehicleRes.data;
    const vehicle = vehicles.find(v => v.number === vehicleNumber);

    if (!vehicle) {
      setError("Vehicle not found.");
      return;
    }

    // Step 2: Send PUT request to update status
    const payload = { status }; // Only status is updated in your backend
    const updateRes = await axios.put(
      `http://localhost:5000/api/vehicles/${vehicle._id}/vehicle-status`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateRes.status === 200) {
      setMessage("Vehicle status updated successfully!");
      setError("");
      setVehicleNumber("");
      setStatus("");
      setLocation("");  // Optional, not used in backend
      setRemarks("");   // Optional, not used in backend
    }
  } catch (error) {
    console.error("Error updating status:", error);
    setError(
      error.response?.data?.message || "Failed to update vehicle status."
    );
    setMessage("");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Update Vehicle Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="Idle">Idle</option>
          <option value="In Transit">In Transit</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Loading">Loading</option>
          <option value="Unloading">Unloading</option>
        </select>
        <input
          type="text"
          placeholder="Current Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {/* Feedback */}
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
        {error && (
          <p className="text-center text-sm text-red-600 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default VehicleStatus;
