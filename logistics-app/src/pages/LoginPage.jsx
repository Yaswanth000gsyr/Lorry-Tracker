// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-gray flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-primary-red">Truck Tracker</h1>

      <div className="max-w-2xl text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-dark-blue">About</h2>
        <p className="text-cool-gray">
          Welcome to <strong className="text-dark-blue">Truck Tracker</strong> – a logistics management platform for lorry owners, drivers, and brokers.
          Manage vehicles, assign trips, log expenses, and auto-generate invoices with ease.
        </p>
      </div>

      <div className="flex gap-4 mt-4 justify-center">
        <button
          className="bg-primary-red text-light-gray px-6 py-2 rounded hover:bg-dark-red transition-colors"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>
        <button
          className="bg-dark-blue text-light-gray px-6 py-2 rounded hover:bg-cool-gray transition-colors"
          onClick={() => navigate("/signup")}
        >
          Signup (Owner/Broker/Driver)
        </button>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default LoginPage;
