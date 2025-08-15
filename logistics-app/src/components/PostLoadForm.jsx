import React, { useState } from "react";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const PostLoadForm = () => {
  const [load, setLoad] = useState({
    brokerNumber: "",
    source: "",
    destination: "",
    loadType: "",
    weight: "",
    date: "",
    price: "",
  });

  const handleChange = (e) => {
    setLoad({ ...load, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // ✅ Use the API_URL variable
      await axios.post(`${API_URL}/api/post-load`, load, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Load posted successfully!");
      setLoad({ brokerNumber: "", source: "", destination: "", loadType: "", weight: "", date: "", price: "" });
    } catch (err) {
      alert("Error posting load");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Post a Load</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="brokerNumber" placeholder="Your Phone Number" value={load.brokerNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="source" placeholder="Source Location" value={load.source} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="destination" placeholder="Destination" value={load.destination} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="loadType" placeholder="Type of Load" value={load.loadType} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="weight" placeholder="Weight (e.g., 10 tons)" value={load.weight} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="date" name="date" value={load.date} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="price" placeholder="Offered Price (₹)" value={load.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Post Load</button>
      </form>
    </div>
  );
};

export default PostLoadForm;
