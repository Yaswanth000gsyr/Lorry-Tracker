import React, { useState } from "react";
import axios from "axios";

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
      await axios.post("http://localhost:5000/api/expense-log", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Expense logged successfully!");
      setFormData({
        vehicleNumber: "",
        driverName: "",
        amount: "",
        expenseName: "",
        category: "",
        date: "",
        notes: "",
      });
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
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900">Expense Log</h3>
          <p className="text-gray-600 text-sm mt-1">
            Track and manage your transportation expenses
          </p>
        </div>
      </div>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter vehicle number"
          />
        </div>

        <div>
          <label
            htmlFor="driverName"
            className="block mb-1 font-medium text-gray-700"
          >
            Driver Name
          </label>
          <input
            type="text"
            id="driverName"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter driver name"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block mb-1 font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter expense amount"
          />
        </div>

        <div>
          <label
            htmlFor="expenseName"
            className="block mb-1 font-medium text-gray-700"
          >
            Expense Name
          </label>
          <input
            type="text"
            id="expenseName"
            name="expenseName"
            value={formData.expenseName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter expense name"
          />
        </div>

        <div>
  <label
    htmlFor="category"
    className="block mb-1 font-medium text-gray-700"
  >
    Category
  </label>
  <select
    id="category"
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select category (optional)</option>
    <option value="Fuel">Fuel</option>
    <option value="Toll">Toll</option>
    <option value="Food">Food</option>
    <option value="Other">Other</option>
  </select>
</div>


        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Select date"
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
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Additional notes (optional)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
        >
          Log Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseLogForm;
