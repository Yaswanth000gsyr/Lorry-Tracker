import React, { useState, useEffect } from "react";
import axios from "axios";

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

        const [checklistRes, expenseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/trip-checklist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/expense-log", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Trip Log</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading trip data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Trip Log</h3>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Trip Checklists */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Trip Checklists</h4>
        {checklists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No trip checklists found</p>
            <p className="text-gray-400 text-sm mt-2">Add your first trip checklist to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {checklists.map((checklist) => (
              <div
                key={checklist._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Load Details</p>
                    <p className="font-medium">{checklist.loadWeight || 0} tonnes • {checklist.loadType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium">{checklist.source || "N/A"} → {checklist.destination || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{checklist.vehicleNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{checklist.driverName || "N/A"}</p>
                  </div>
                </div>
                {checklist.notes && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{checklist.notes}</p>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created: {formatDate(checklist.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses */}
      <div>
        <h4 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Expenses</h4>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No expenses found</p>
            <p className="text-gray-400 text-sm mt-2">Add your first expense to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{expense.vehicleNumber ?? expense.vehicle?.vehicleNumber ?? "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{expense.driverName ?? expense.driver?.driverName ?? "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expense</p>
                    <p className="font-medium">{expense.expenseName ?? expense.category ?? expense.title ?? "Expense"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{formatDate(expense.expenseDate ?? expense.date ?? expense.createdAt)}</p>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Fuel</p>
                    <p className="font-medium text-blue-600">{formatCurrency(expense.fuel ?? expense.fuelCost ?? 0)}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Toll</p>
                    <p className="font-medium text-green-600">{formatCurrency(expense.toll ?? expense.tollCost ?? 0)}</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Food</p>
                    <p className="font-medium text-yellow-600">{formatCurrency(expense.food ?? expense.foodCost ?? 0)}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Other</p>
                    <p className="font-medium text-purple-600">{formatCurrency(expense.other ?? expense.maintenance ?? expense.miscellaneous ?? 0)}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Total: {formatCurrency(expense.amount)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(expense.createdAt)}
                  </span>
                </div>
                
                {expense.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Notes: {expense.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripLog;
