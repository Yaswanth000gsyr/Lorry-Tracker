import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = (
    <>
      <Link to="/" className="hover:text-primary-red transition-colors">Home</Link>
      <Link to="/add-vehicle" className="hover:text-primary-red transition-colors">Add Vehicle</Link>
      <Link to="/assign-driver" className="hover:text-primary-red transition-colors">Assign Driver</Link>
      <Link to="/plan-trip" className="hover:text-primary-red transition-colors">Trip Planner</Link>
      <Link to="/log-expenses" className="hover:text-primary-red transition-colors">Expense Logger</Link>
      <Link to="/invoice" className="hover:text-primary-red transition-colors">Invoice</Link>
    </>
  );

  return (
    <nav className={`px-6 py-4 shadow-lg flex justify-between items-center transition ${isDarkMode ? 'bg-dark-blue text-light-gray' : 'bg-light-gray text-dark-blue'}`}>
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/">🚛 Lorry Tracker</Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6 text-lg">
        {navLinks}
        <button onClick={toggleDarkMode} className="hover:text-primary-red transition-colors">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {isLoggedIn ? (
          <div className="relative group">
            <button className="hover:text-primary-red transition-colors">Profile ▾</button>
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-dark-blue text-light-gray rounded shadow-lg w-40 z-10">
              <Link to="/profile" className="block px-4 py-2 hover:bg-cool-gray transition-colors">My Profile</Link>
              <button onClick={toggleLogin} className="w-full text-left px-4 py-2 hover:bg-cool-gray transition-colors">Logout</button>
            </div>
          </div>
        ) : (
          <button onClick={toggleLogin} className="bg-primary-red hover:bg-dark-red px-4 py-2 rounded text-light-gray transition-colors">
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button onClick={toggleMobileMenu} className="md:hidden">
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`absolute top-16 left-0 w-full px-6 py-4 flex flex-col space-y-4 text-lg z-50 ${isDarkMode ? 'bg-dark-blue text-light-gray' : 'bg-light-gray text-dark-blue'}`}>
          {navLinks}
          <button onClick={toggleDarkMode} className="text-left hover:text-primary-red transition-colors">
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-primary-red transition-colors">My Profile</Link>
              <button onClick={toggleLogin} className="hover:text-primary-red transition-colors">Logout</button>
            </>
          ) : (
            <button onClick={toggleLogin} className="hover:text-primary-red transition-colors">Login</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
