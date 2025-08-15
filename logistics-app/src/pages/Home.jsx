import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-500 text-center">
        Welcome to LorryTracker 🚛
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-xl">
        A one-stop solution for vehicle tracking, trip planning, expense logging,
        and invoice generation for lorry owners.
      </p>
      <Link
        to="/dashboard"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;
