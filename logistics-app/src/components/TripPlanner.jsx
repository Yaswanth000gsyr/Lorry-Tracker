import React, { useState } from "react";
import axios from "axios"; // Make sure to import axios

// Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const TripPlanner = () => {
  const [trip, setTrip] = useState({
    vehicleNumber: "",
    driverName: "",
    startLocation: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    goodsDescription: "",
  });

  // State for handling success and error messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  // ✅ FIXED: This function now sends the data to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to plan a trip.");
        setLoading(false);
        return;
      }

      // Send the trip data to the backend API endpoint
      const response = await axios.post(
        `${API_URL}/api/plan-trip`,
        trip,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      setMessage(response.data.message || "Trip planned successfully!");
      setLoading(false);

      // Clear the form
      setTrip({
        vehicleNumber: "",
        driverName: "",
        startLocation: "",
        destination: "",
        departureDate: "",
        arrivalDate: "",
        goodsDescription: "",
      });

    } catch (err) {
      // Handle errors from the backend
      setError(err.response?.data?.message || "An error occurred while planning the trip.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-8 rounded-xl border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Plan a Trip
      </h2>
      {message && <p className="text-green-600 bg-green-100 p-3 rounded-md mb-4">{message}</p>}
      {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={trip.vehicleNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={trip.driverName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          name="startLocation"
          placeholder="Start Location"
          value={trip.startLocation}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={trip.destination}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
          required
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Departure Date</label>
                <input
                    type="date"
                    name="departureDate"
                    value={trip.departureDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
                    required
                />
            </div>
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                <label className="block text-sm font-medium text-gray-600 mb-1">Arrival Date (Est.)</label>
                <input
                    type="date"
                    name="arrivalDate"
                    value={trip.arrivalDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
                />
            </div>
        </div>
        <textarea
          name="goodsDescription"
          placeholder="Goods Description"
          value={trip.goodsDescription}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md font-semibold disabled:bg-gray-400 transition"
        >
          {loading ? 'Planning...' : 'Plan Trip'}
        </button>
      </form>
    </div>
  );
};

export default TripPlanner;
