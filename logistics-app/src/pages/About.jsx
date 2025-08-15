// src/pages/About.jsx
import React from "react";

const About = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-red-700">About Lorry Tracker</h1>
      <p className="text-lg leading-relaxed mb-4">
        <strong>Lorry Tracker</strong> is a smart logistics management platform designed for lorry owners,
        drivers, and brokers. It helps manage vehicle assignments, track trips, log expenses,
        and generate invoices all in one place.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>Track vehicle location in real-time.</li>
        <li>Assign drivers to specific vehicles and trips.</li>
        <li>Plan trips with start & destination locations.</li>
        <li>Log trip expenses like fuel, tolls, and food.</li>
        <li>Generate professional invoices automatically.</li>
      </ul>
    </div>
  );
};

export default About;
