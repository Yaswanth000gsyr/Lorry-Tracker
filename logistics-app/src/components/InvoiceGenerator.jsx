import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    vehicleNumber: "",
    driverName: "",
    startPoint: "",
    endPoint: "",
    tripDate: "",
    totalExpense: 0,
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const fetchTotalExpense = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      // ✅ Use the API_URL variable
      const res = await axios.get(`${API_URL}/api/trips/total-expense`, {
        params: {
          vehicleNumber: invoiceData.vehicleNumber,
          tripDate: invoiceData.tripDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoiceData((prev) => ({ ...prev, totalExpense: res.data.total || 0 }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch total expense");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchTotalExpense();
    setShowInvoice(true);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Generate Invoice</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="vehicleNumber" placeholder="Vehicle Number" value={invoiceData.vehicleNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="text" name="driverName" placeholder="Driver Name" value={invoiceData.driverName} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" />
        <input type="text" name="startPoint" placeholder="Start Point" value={invoiceData.startPoint} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="text" name="endPoint" placeholder="End Point" value={invoiceData.endPoint} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <input type="date" name="tripDate" value={invoiceData.tripDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3" required />
        <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-md font-semibold">
          {loading ? "Calculating..." : "Generate Invoice"}
        </button>
      </form>
      {showInvoice && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Invoice</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-800">
            <p><strong>Vehicle:</strong> {invoiceData.vehicleNumber}</p>
            <p><strong>Driver:</strong> {invoiceData.driverName}</p>
            <p><strong>From:</strong> {invoiceData.startPoint}</p>
            <p><strong>To:</strong> {invoiceData.endPoint}</p>
            <p><strong>Date:</strong> {invoiceData.tripDate}</p>
            <p><strong>Total Expense:</strong> ₹{invoiceData.totalExpense}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
