import React, { useState } from "react";

const TripPlanner = () => {
  const [trip, setTrip] = useState({
    vehicleNumber: "",
    driverName: "",
    startLocation: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    goodsDescription: "",
  });

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Planned Trip:", trip);
    // Send trip data to backend here
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Plan a Trip
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={trip.vehicleNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
          required
        />
        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={trip.driverName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
        />
        <input
          type="text"
          name="startLocation"
          placeholder="Start Location"
          value={trip.startLocation}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={trip.destination}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-3"
          required
        />
        <div className="flex space-x-4">
          <input
            type="date"
            name="departureDate"
            value={trip.departureDate}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md p-3"
            required
          />
          <input
            type="date"
            name="arrivalDate"
            value={trip.arrivalDate}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 rounded-md p-3"
          />
        </div>
        <textarea
          name="goodsDescription"
          placeholder="Goods Description"
          value={trip.goodsDescription}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md p-3"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md font-semibold"
        >
          Plan Trip
        </button>
      </form>
    </div>
  );
};

export default TripPlanner;
