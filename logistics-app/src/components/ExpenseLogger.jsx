// src/components/ExpenseLogger.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

export default function ExpenseLogger() {
  const [form, setForm] = useState({
    vehicleNumber: "",
    driverName: "",
    tripDate: "",
    fuel: 0,
    tolls: 0,
    food: 0,
    other: 0
  });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get(API_URL);
    setExpenses(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, {
      ...form,
      fuel: Number(form.fuel),
      tolls: Number(form.tolls),
      food: Number(form.food),
      other: Number(form.other)
    });
    setForm({
      vehicleNumber: "",
      driverName: "",
      tripDate: "",
      fuel: 0,
      tolls: 0,
      food: 0,
      other: 0
    });
    fetchExpenses();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Logger</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="vehicleNumber"
          value={form.vehicleNumber}
          onChange={handleChange}
          placeholder="Vehicle Number"
          className="p-2 border rounded"
        />
        <input
          name="driverName"
          value={form.driverName}
          onChange={handleChange}
          placeholder="Driver Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="tripDate"
          type="date"
          value={form.tripDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="fuel"
          type="number"
          value={form.fuel}
          onChange={handleChange}
          placeholder="Fuel ₹"
          className="p-2 border rounded"
        />
        <input
          name="tolls"
          type="number"
          value={form.tolls}
          onChange={handleChange}
          placeholder="Tolls ₹"
          className="p-2 border rounded"
        />
        <input
          name="food"
          type="number"
          value={form.food}
          onChange={handleChange}
          placeholder="Food ₹"
          className="p-2 border rounded"
        />
        <input
          name="other"
          type="number"
          value={form.other}
          onChange={handleChange}
          placeholder="Other ₹"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="space-y-4">
        {expenses.map((exp) => (
          <div
            key={exp._id}
            className="border p-4 rounded shadow bg-white"
          >
            <p><strong>Vehicle Number:</strong> {exp.vehicleNumber}</p>
            <p><strong>Driver Name:</strong> {exp.driverName}</p>
            <p><strong>Trip Date:</strong> {exp.tripDate}</p>
            <p><strong>Fuel:</strong> ₹{exp.fuel}</p>
            <p><strong>Tolls:</strong> ₹{exp.tolls}</p>
            <p><strong>Food:</strong> ₹{exp.food}</p>
            <p><strong>Other:</strong> ₹{exp.other}</p>
            <p><strong>Total Amount:</strong> ₹{exp.totalAmount}</p>
            <p><strong>Created:</strong> {new Date(exp.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
