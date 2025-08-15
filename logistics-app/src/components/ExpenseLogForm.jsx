import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const ExpenseLogForm = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    driverName: "",
    amount: "",
    expenseName: "",
    category: "",
    date: "",
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
      await axios.post(`${API_URL}/api/expense-log`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Expense logged successfully!");
      setFormData({ vehicleNumber: "", driverName: "", amount: "", expenseName: "", category: "", date: "", notes: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log expense");
      setSuccess("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-300 max-w-md mx-auto mt-10">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
          {/* SVG Icon */}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900">Expense Log</h3>
          <p className="text-gray-600 text-sm mt-1">Track and manage your transportation expenses</p>
        </div>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-3 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" id="vehicleNumber" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter vehicle number" />
        <input type="text" id="driverName" name="driverName" value={formData.driverName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter driver name" />
        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter expense amount" />
        <input type="text" id="expenseName" name="expenseName" value={formData.expenseName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter expense name" />
        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
          <option value="">Select category</option>
          <option value="Fuel">Fuel</option>
          <option value="Toll">Toll</option>
          <option value="Food">Food</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Select date" />
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Additional notes (optional)"></textarea>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition">Log Expense</button>
      </form>
    </div>
  );
};

export default ExpenseLogForm;
