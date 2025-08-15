import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostedLoads from "./PostedLoads";

const BrokerDashboard = () => {
  const navigate = useNavigate();
  const [showPostedLoads, setShowPostedLoads] = useState(false);
  
  const actions = [
    { label: "📦 Post Load", path: "/post-load" },
    { label: "📋 Posted Loads", action: () => setShowPostedLoads(true) },
    { label: "📅 Manage Bookings", path: "/manage-bookings" },
  ];
  
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    
    // Redirect to login page
    navigate("/");
  };

  if (showPostedLoads) {
    return (
      <div className="min-h-screen bg-light-gray py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowPostedLoads(false)}
            className="mb-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            ← Back to Dashboard
          </button>
          <PostedLoads />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-10 px-6">
      <h2 className="text-4xl font-bold text-center text-dark-blue mb-2">
        LorryTracker Broker Dashboard
      </h2>
      <p className="text-center text-lg text-cool-gray mb-10">
        Welcome, Broker
      </p>
      
      <div className="flex justify-center mb-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {actions.map((item, index) => (
          <button
            key={index}
            onClick={item.action ? item.action : () => navigate(item.path)}
            className="bg-white border border-cool-gray shadow hover:shadow-xl rounded-2xl p-6 text-center text-lg font-semibold text-dark-blue hover:bg-cool-gray hover:text-light-gray transition duration-200"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrokerDashboard;
