import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const EditLoad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [load, setLoad] = useState({
    brokerNumber: "",
    source: "",
    destination: "",
    loadType: "",
    weight: "",
    date: "",
    price: "",
    status: "available",
  });

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        const token = localStorage.getItem("token");
        // ✅ Use the API_URL variable
        const res = await axios.get(`${API_URL}/api/loads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoad({
          brokerNumber: res.data.brokerNumber || "",
          source: res.data.source || "",
          destination: res.data.destination || "",
          loadType: res.data.loadType || "",
          weight: res.data.weight || "",
          date: res.data.date ? res.data.date.slice(0, 10) : "",
          price: res.data.price || "",
          status: res.data.status || "available",
        });
      } catch (err) {
        console.error("Error fetching load:", err);
      }
    };
    fetchLoad();
  }, [id]);

  const handleChange = (e) => {
    setLoad({ ...load, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // ✅ Use the API_URL variable
      await axios.put(`${API_URL}/api/loads/${id}`, load, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Load updated successfully!");
      navigate("/broker-dashboard"); // Navigate back to a relevant page
    } catch (err) {
      alert("Error updating load");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Load</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="brokerNumber" placeholder="Your Phone Number" value={load.brokerNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="source" placeholder="Source Location" value={load.source} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="destination" placeholder="Destination" value={load.destination} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="loadType" placeholder="Type of Load" value={load.loadType} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="weight" placeholder="Weight (e.g., 10 tons)" value={load.weight} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="date" name="date" value={load.date} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="price" placeholder="Offered Price (₹)" value={load.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
        <select name="status" value={load.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Update Load</button>
      </form>
    </div>
  );
};

export default EditLoad;
