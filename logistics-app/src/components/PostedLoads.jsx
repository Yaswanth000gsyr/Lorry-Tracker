import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Use environment variable for the API URL
const API_URL = 'https://lorry-tracker-backend.onrender.com';

const PostedLoads = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostedLoads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const brokerId = user?._id;

        if (!token || !brokerId) {
          navigate('/');
          return;
        }

        // ✅ Use the API_URL variable
        const response = await axios.get(`${API_URL}/api/loads/broker/${brokerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setLoads(response.data);
      } catch (err) {
        setError('Failed to fetch posted loads');
        console.error('Error fetching loads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostedLoads();
  }, [navigate]);

  const handleDelete = async (loadId) => {
    if (window.confirm('Are you sure you want to delete this load?')) {
      try {
        const token = localStorage.getItem('token');
        // ✅ Use the API_URL variable
        await axios.delete(`${API_URL}/api/loads/${loadId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoads(loads.filter(load => load._id !== loadId));
      } catch (err) {
        alert('Failed to delete load');
        console.error('Error deleting load:', err);
      }
    }
  };

  const handleEdit = (loadId) => {
    navigate(`/edit-load/${loadId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-blue">Posted Loads</h2>
        <Link to="/post-load" className="bg-dark-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
          + Post New Load
        </Link>
      </div>
      {loads.length === 0 ? (
        <p>No loads posted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Head */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loads.map((load) => (
                <tr key={load._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{load.source} → {load.destination}</td>
                  <td className="px-6 py-4">{load.loadType}, {load.weight}</td>
                  <td className="px-6 py-4">₹{load.price}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(load._id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(load._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostedLoads;
