import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const AvailableLoads = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          navigate("/");
          return;
        }
        if (user.role !== "owner") {
          setError("Access restricted to owners");
          navigate("/");
          return;
        }

        // ✅ Use the API_URL variable
        const response = await fetch(`${API_URL}/api/loads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
            return;
          }
          throw new Error(errorData.message || "Failed to fetch loads");
        }

        const data = await response.json();
        setLoads(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-10 text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-700">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-red-50 py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Available Loads
      </h2>
      <button
        onClick={() => navigate("/owner-dashboard")}
        className="mb-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
      {loads.length === 0 ? (
        <p className="text-center text-gray-600">No loads available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {loads.map((load) => (
            <div
              key={load._id}
              className="bg-white border border-gray-200 shadow hover:shadow-xl rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {load.source} to {load.destination}
              </h3>
              <p className="text-gray-600">Load Type: {load.loadType}</p>
              <p className="text-gray-600">Weight: {load.weight}</p>
              <p className="text-gray-600">Price: ₹{load.price}</p>
              <p className="text-gray-600">
                Date: {new Date(load.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Posted by: {load.postedBy?.email || "Unknown"} ({load.brokerNumber})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableLoads;
