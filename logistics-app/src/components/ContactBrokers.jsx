import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const ContactBrokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBrokers = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ Use the API_URL variable
      const response = await axios.get(`${API_URL}/api/brokers`, {
        headers: {
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
        },
      });
      setBrokers(response.data || []);
    } catch (err) {
      console.error("Error fetching brokers:", err);
      let errorMessage = "Failed to load brokers. Please try again.";
      if (err.response?.status === 401) {
        errorMessage = "Unauthorized. Please log in again.";
      } else if (err.response?.data?.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-red-50 p-4 sm:p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Contact Brokers
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading brokers...</p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-600" role="alert">{error}</p>
          <button
            onClick={fetchBrokers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Retry fetching brokers"
          >
            Retry
          </button>
        </div>
      ) : brokers.length === 0 ? (
        <p className="text-center text-gray-600">No brokers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {brokers.map((broker) => (
            <div
              key={broker._id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {broker.email}
              </h3>
              <p className="text-gray-600 mb-1">
                📧 Email:{" "}
                {broker.email ? (
                  <a href={`mailto:${broker.email}`} className="text-blue-600 hover:underline">
                    {broker.email}
                  </a>
                ) : "N/A"}
              </p>
              <p className="text-gray-600">
                📞 Phone:{" "}
                {broker.number ? (
                  <a href={`tel:${broker.number}`} className="text-blue-600 hover:underline">
                    {broker.number}
                  </a>
                ) : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactBrokers;
