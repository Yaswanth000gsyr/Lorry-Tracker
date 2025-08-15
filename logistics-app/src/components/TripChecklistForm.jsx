import React, { useState } from "react";
import axios from "axios";

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
      await axios.post("http://localhost:5000/api/trip-checklist", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Trip checklist submitted successfully!");
      setFormData({
        loadWeight: "",
        loadType: "",
        source: "",
        destination: "",
        vehicleNumber: "",
        notes: "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit checklist");
      setSuccess("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-300 max-w-md mx-auto mt-10">
      <h3 className="text-3xl font-bold text-gray-900 mb-6">Trip Checklist</h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 mb-4 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="loadWeight"
            className="block mb-1 font-medium text-gray-700"
          >
            Load Weight (tonnes)
          </label>
          <input
            type="number"
            id="loadWeight"
            name="loadWeight"
            value={formData.loadWeight}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            placeholder="Enter load weight"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="loadType"
            className="block mb-1 font-medium text-gray-700"
          >
            Load Type
          </label>
          <input
            type="text"
            id="loadType"
            name="loadType"
            value={formData.loadType}
            onChange={handleChange}
            required
            placeholder="Enter load type"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="source"
            className="block mb-1 font-medium text-gray-700"
          >
            Source
          </label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            placeholder="Enter source location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block mb-1 font-medium text-gray-700"
          >
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            placeholder="Enter destination location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="vehicleNumber"
            className="block mb-1 font-medium text-gray-700"
          >
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
            placeholder="Enter vehicle number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block mb-1 font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional notes (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
        >
          Submit Checklist
        </button>
      </form>
    </div>
  );
};

export default TripChecklistForm;
