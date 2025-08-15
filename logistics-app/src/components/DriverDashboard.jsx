
import React from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TripChecklistForm from "./TripChecklistForm";
import ExpenseLogForm from "./ExpenseLogForm";
import TripLog from "./TripLog";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const actions = [
    { label: "📋 Trip Checklist", path: "/driver-dashboard/driver-trips" },
    { label: "💸 Expenses Log", path: "/driver-dashboard/driver-expenses" },
    { label: "📜 Trip Log", path: "/driver-dashboard/trip-log" },
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-light-gray py-10 px-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <div>
          <h2 className="text-4xl font-bold text-dark-blue mb-2">
            LorryTracker Driver Dashboard
          </h2>
          <p className="text-lg text-cool-gray">
            Welcome, Driver
          </p>
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

      {/* Routes Section */}
      <div className="max-w-4xl mx-auto">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/driver-dashboard/driver-trips" />}
          />
          <Route path="/driver-trips" element={<TripChecklistForm />} />
          <Route path="/driver-expenses" element={<ExpenseLogForm />} />
          <Route path="/trip-log" element={<TripLog />} />
        </Routes>
      </div>
    </div>
  );
};

export default DriverDashboard;
