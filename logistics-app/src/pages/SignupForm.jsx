import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Define the API URL using the environment variable
const API_URL = https://lorry-tracker-backend.onrender.com;

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
    number: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Use the API_URL variable in your fetch call
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        // The signup form doesn't have a 'name' field in the state to check.
        // Assuming navigation is based on role.
        navigate(
          formData.role === "owner" ? "/owner-dashboard" : 
          formData.role === "broker" ? "/broker-dashboard" : 
          "/driver-dashboard"
        );
      } else {
        // ✅ Use data.message to match your backend's error response
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      // ✅ Provide a more helpful alert for network errors
      alert("An error occurred. Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-700">
          Signup Form
        </h2>

        {/* Your form inputs remain the same... */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your name"
          />
        </div>

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

        <div className="mb-4">
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

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="owner">Owner</option>
            <option value="broker">Broker</option>
            <option value="driver">Driver</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="number"
            required
            value={formData.number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your phone number"
          />
        </div>


        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
        >
          Register
        </button>

        <p
          className="text-center mt-4 text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
