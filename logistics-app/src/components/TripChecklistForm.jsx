import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const TripChecklistForm = () => {
  const [formData, setFormData] = useState({
    loadWeight: "",
    loadType: "",
    source: "",
    destination: "",
    vehicleNumber: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // ✅ Use the API_URL variable
      await axios.post(`${API_URL}/api/trip-checklist`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Trip checklist submitted successfully!");
      setFormData({ loadWeight: "", loadType: "", source: "", destination: "", vehicleNumber: "", notes: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit checklist");
      setSuccess("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-300 max-w-md mx-auto mt-10">
      <h3 className="text-3xl font-bold text-gray-900 mb-6">Trip Checklist</h3>
      {error && <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="number" id="loadWeight" name="loadWeight" value={formData.loadWeight} onChange={handleChange} required min="0" step="0.1" placeholder="Enter load weight" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" id="loadType" name="loadType" value={formData.loadType} onChange={handleChange} required placeholder="Enter load type" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" id="source" name="source" value={formData.source} onChange={handleChange} required placeholder="Enter source location" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleChange} required placeholder="Enter destination location" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <input type="text" id="vehicleNumber" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="Enter vehicle number" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} placeholder="Additional notes (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition">Submit Checklist</button>
      </form>
    </div>
  );
};

export default TripChecklistForm;
