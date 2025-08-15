// src/components/LoginModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Best Practice: Use the environment variable for the API URL
const API_URL = https://lorry-tracker-backend.onrender.com;

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // ✅ Use the API_URL variable in the fetch call
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful, save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Navigate based on user role
        switch (data.user.role) {
          case "owner":
            navigate("/owner-dashboard");
            break;
          case "broker":
            navigate("/broker-dashboard");
            break;
          case "driver":
            navigate("/driver-dashboard");
            break;
          default:
            navigate("/"); // Fallback to home
        }
        onClose(); // Close the modal
      } else {
        // Show error message from the server
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Could not connect to the server. Please try again later.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-red">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary-red text-white w-full py-2 rounded hover:bg-dark-red transition-colors"
            >
              Login
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center mt-4 text-cool-gray cursor-pointer hover:underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
