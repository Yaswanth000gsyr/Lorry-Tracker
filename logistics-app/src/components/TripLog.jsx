import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const TripLog = () => {
  const [checklists, setChecklists] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // ✅ Use the API_URL variable
        const [checklistRes, expenseRes] = await Promise.all([
          axios.get(`${API_URL}/api/trip-checklist`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/expense-log`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        setChecklists(checklistRes.data || []);
        setExpenses(expenseRes.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching trip log:", err);
        setError(err.response?.data?.message || "Failed to fetch trip log");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ... (rest of the component is fine)
  
  if (loading) return <div>Loading trip data...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Trip Log</h3>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Trip Checklists</h4>
        {checklists.length === 0 ? <p>No trip checklists found</p> : (
          <div className="grid gap-4">
            {checklists.map((checklist) => (
              <div key={checklist._id} className="border rounded-lg p-4">
                <p><strong>Route:</strong> {checklist.source} → {checklist.destination}</p>
                <p><strong>Vehicle:</strong> {checklist.vehicleNumber}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Expenses</h4>
        {expenses.length === 0 ? <p>No expenses found</p> : (
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <div key={expense._id} className="border rounded-lg p-4">
                <p><strong>Expense:</strong> {expense.expenseName || expense.category}</p>
                <p><strong>Amount:</strong> ₹{expense.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripLog;
