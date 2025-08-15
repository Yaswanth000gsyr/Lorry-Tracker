import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableLoads, deleteLoad, getPostedLoadsByBroker } from '../services/api';

const PostedLoads = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostedLoads();
  }, []);

  const fetchPostedLoads = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const brokerId = user?.id || user?._id;
      
      // Use the available loads endpoint and filter by postedBy
      const response = await getAvailableLoads();
      const allLoads = response.data;
      
      // Filter loads posted by the current broker
      const brokerLoads = allLoads.filter(load => 
        load.postedBy === brokerId || 
        (load.postedBy && load.postedBy._id === brokerId)
      );
      
      setLoads(brokerLoads);
    } catch (err) {
      setError('Failed to fetch posted loads');
      console.error('Error fetching loads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (loadId) => {
    if (window.confirm('Are you sure you want to delete this load?')) {
      try {
        await deleteLoad(loadId);
        setLoads(loads.filter(load => load._id !== loadId));
      } catch (err) {
        alert('Failed to delete load');
        console.error('Error deleting load:', err);
      }
    }
  };

  const handleEdit = (loadId) => {
    // Navigate to edit page
    window.location.href = `/edit-load/${loadId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-blue">Posted Loads</h2>
        <Link
          to="/post-load"
          className="bg-dark-blue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          + Post New Load
        </Link>
      </div>

      {loads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No loads posted yet.</p>
          <Link to="/post-load" className="text-dark-blue hover:underline mt-2 inline-block">
            Post your first load
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Load Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loads.map((load) => (
                <tr key={load.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {load.loadType}
                    </div>
                    <div className="text-sm text-gray-500">
                      {load.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {load.origin} → {load.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {load.weight} lbs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${load.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      load.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : load.status === 'booked'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {load.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(load.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(load.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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
