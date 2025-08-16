import React, { useEffect, useState } from "react";
// In a real project, you would use 'react-router-dom'.
// This is a simplified router to make the components work together in this environment.

// --- MOCK NAVIGATION ---
const Router = ({ children }) => {
  const [page, setPage] = useState(window.location.hash || '#/');
  const handleHashChange = () => setPage(window.location.hash || '#/');
  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const routes = React.Children.toArray(children).reduce((acc, child) => {
    const path = child.props.path.startsWith(':') ? new RegExp(`^${child.props.path.replace(/:[^\s/]+/g, '([\\w-]+)')}$`) : child.props.path;
    acc[path] = child.props.element;
    return acc;
  }, {});
  const path = page.substring(1);
  const matchedRoute = Object.keys(routes).find(route => new RegExp(route).test(path));
  return routes[matchedRoute] || routes['/'];
};
const Route = ({ element }) => element;
const useNavigate = () => (path) => { window.location.hash = path; };
const Link = ({ to, children, className }) => <a href={`#${to}`} className={className}>{children}</a>;
const useParams = () => {
    const hash = window.location.hash.substring(1);
    const parts = hash.split('/');
    return { id: parts[1] }; // Simple param parsing for /path/:id
};

// --- API URL ---
const API_URL = 'https://lorry-tracker-backend.onrender.com';

// --- COMPONENTS ---

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const ownerName = "Welcome, Owner";
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");

  const handleLogout = () => {
    // Mocking localStorage
    console.log("Logged out.");
    navigate("/");
  };

  useEffect(() => {
    const fetchVehicles = () => {
      console.log("Fetching latest vehicle data for dashboard...");
      // Mocking API call
      const mockVehicles = [
          { _id: '1', number: 'TS09 FZ 5555', type: 'Truck', capacity: 20, status: 'available' },
          { _id: '2', number: 'AP07 GZ 6677', type: 'Lorry', capacity: 15, status: 'under trip' },
          { _id: '3', number: 'KA01 HZ 8899', type: 'Truck', capacity: 25, status: 'available' },
          { _id: '4', number: 'TN02 IZ 1122', type: 'Lorry', capacity: 18, status: 'under repair' },
      ];
      setVehicles(mockVehicles);
    };
    fetchVehicles();
  }, []);

  const actions = [
    { label: "📋 Plan a Trip", path: "/plan-trip" },
    { label: "🚛 Register Vehicle", path: "/add-vehicle" },
    { label: "👷 Update Vehicle Status", path: "/vehicle-status" },
    { label: "📄 Generate Invoice", path: "/generate-invoice" },
    { label: "📋 View Available Loads", path: "/loads" },
    { label: "📞 Contact Brokers", path: "/contact-brokers" },
  ];

  const availableVehicles = vehicles.filter((v) => v.status === "available");
  const unavailableVehicles = vehicles.filter((v) => v.status !== "available");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 font-sans">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">LorryTracker Owner Dashboard</h2>
          <p className="text-lg text-gray-600">{ownerName}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Logout</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {actions.map((item) => (
          <Link key={item.path} to={item.path} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl rounded-2xl p-6 text-center text-lg font-semibold text-gray-800 hover:bg-red-500 hover:text-white transition">
            {item.label}
          </Link>
        ))}
      </div>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Availability</h3>
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Available ({availableVehicles.length})
            </h4>
            <div className="space-y-4">
              {availableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-semibold text-gray-800">{vehicle.number}</h5>
                  <p className="text-sm text-gray-500">{vehicle.type} • {vehicle.capacity} tons • <span className="font-medium text-green-600">{vehicle.status}</span></p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              Unavailable ({unavailableVehicles.length})
            </h4>
            <div className="space-y-4">
              {unavailableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h5 className="font-semibold text-gray-800">{vehicle.number}</h5>
                  <p className="text-sm text-gray-500">{vehicle.type} • {vehicle.capacity} tons • <span className="font-medium text-red-600">{vehicle.status}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ FIXED VehicleStatus Component
const VehicleStatus = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // This is a placeholder for the actual API call logic
      console.log(`Simulating update for ${vehicleNumber} to status ${status}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // On success:
      setMessage("Vehicle status updated successfully! Redirecting...");
      
      // ✅ FIX: Navigate back to the dashboard after a short delay.
      // This forces the OwnerDashboard to re-mount and fetch fresh data.
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 1500);

    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update vehicle status.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto mt-10 p-8 border rounded-xl shadow-lg bg-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold mb-4 text-center">Update Vehicle Status</h2>
                <Link to="/owner-dashboard" className="text-2xl text-gray-500 hover:text-gray-800">&times;</Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="w-full p-2 border rounded" required />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded" required>
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="under trip">Under Trip</option>
                    <option value="under repair">Under Repair</option>
                </select>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {loading ? 'Updating...' : 'Submit'}
                </button>
                {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
                {error && <p className="text-center text-sm text-red-600 mt-2">{error}</p>}
            </form>
        </div>
    </div>
  );
};

// Other components (TripPlanner, InvoiceGenerator, etc.) would go here...
const TripPlanner = () => (<div>Trip Planner Page</div>);
const VehicleForm = () => (<div>Vehicle Form Page</div>);
const InvoiceGenerator = () => (<div>Invoice Generator Page</div>);
const AvailableLoads = () => (<div>Available Loads Page</div>);
const ContactBrokers = () => (<div>Contact Brokers Page</div>);


// --- Main App Component with Routing ---
const App = () => {
  return (
    <Router>
      <Route path="/" element={<OwnerDashboard />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/vehicle-status" element={<VehicleStatus />} />
      <Route path="/plan-trip" element={<TripPlanner />} />
      <Route path="/add-vehicle" element={<VehicleForm />} />
      <Route path="/generate-invoice" element={<InvoiceGenerator />} />
      <Route path="/loads" element={<AvailableLoads />} />
      <Route path="/contact-brokers" element={<ContactBrokers />} />
    </Router>
  );
};

export default App;
