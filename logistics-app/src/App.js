import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages & Components
import LoginPage from "./pages/LoginPage";
import SignupForm from "./pages/SignupForm";
import OwnerDashboard from "./components/OwnerDashboard";
import DriverDashboard from "./components/DriverDashboard";
import BrokerDashboard from "./components/BrokerDashboard";
import ExpenseLogger from "./components/ExpenseLogger";
import InvoiceGenerator from "./components/InvoiceGenerator";
import TripPlanner from "./components/TripPlanner";
import VehicleForm from "./components/VehicleForm";
import ContactBrokers from "./components/ContactBrokers";
import PostLoadForm from "./components/PostLoadForm";
import AvailableLoads from "./components/AvailableLoads";
import VehicleStatus from "./components/VehicleStatus";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/driver-dashboard/*" element={<DriverDashboard />} />
        <Route path="/broker-dashboard" element={<BrokerDashboard />} />
        <Route path="/vehicle-status" element={<VehicleStatus />} />
        <Route path="/update-vehicle-status" element={<VehicleStatus />} />
        <Route path="/log-expense" element={<ExpenseLogger />} />
        <Route path="/generate-invoice" element={<InvoiceGenerator />} />
        <Route path="/plan-trip" element={<TripPlanner />} />
        <Route path="/add-vehicle" element={<VehicleForm />} />
        <Route path="/contact-brokers" element={<ContactBrokers />} />
        <Route path="/post-load" element={<PostLoadForm />} />
        <Route path="/loads" element={<AvailableLoads />} />
        {/* <Route path="/colors" element={<ColorPaletteDemo />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
