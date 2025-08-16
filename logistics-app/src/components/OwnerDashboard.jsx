import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Correct, flexible API URL for both local and deployed environments
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const ownerName = "Welcome, Owner";
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. Please try logging in again.");
      }
    };
    fetchVehicles();
  }, []);

  // ✅ "Generate Invoice" button has been added here
  const actions = [
    { label: "📋 View Available Loads", path: "/loads" },
    { label: "🚛 Register Vehicle", path: "/add-vehicle" },
    { label: "👷 Vehicle Status", path: "/vehicle-status" },
    { label: "📞 Contact Brokers", path: "/contact-brokers" },
    { label: "📄 Generate Invoice", path: "/generate-invoice" },
  ];

  const availableVehicles = vehicles.filter((v) => v.status === "available");
  const unavailableVehicles = vehicles.filter((v) => v.status !== "available");

  return (
    <div className="min-h-screen bg-light-gray py-10 px-6">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <div>
          <h2 className="text-4xl font-bold text-dark-blue mb-2">
            LorryTracker Owner Dashboard
          </h2>
          <p className="text-lg text-cool-gray">{ownerName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        {actions.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="bg-white border border-cool-gray shadow hover:shadow-xl rounded-2xl p-6 text-center text-lg font-semibold text-dark-blue hover:bg-cool-gray hover:text-light-gray transition duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Vehicle Availability Section */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-dark-blue mb-6">Vehicle Availability</h3>
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-dark-blue mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Available Vehicles ({availableVehicles.length})
            </h4>
            <div className="space-y-4">
              {availableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white border border-cool-gray rounded-lg p-4 shadow-sm">
                  <h5 className="font-semibold text-dark-blue">{vehicle.number}</h5>
                  <p className="text-sm text-cool-gray">{vehicle.type} • {vehicle.capacity} tons</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-dark-blue mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Unavailable Vehicles ({unavailableVehicles.length})
            </h4>
            <div className="space-y-4">
              {unavailableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white border border-cool-gray rounded-lg p-4 shadow-sm">
                  <h5 className="font-semibold text-dark-blue">{vehicle.number}</h5>
                  <p className="text-sm text-cool-gray">{vehicle.type} • {vehicle.capacity} tons</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
