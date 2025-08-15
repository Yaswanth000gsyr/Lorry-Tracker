// --- Changes Start ---
require('dotenv').config(); // Loads variables from .env file into process.env
const express = require("express");
const mongoose = require("mongoose");
const cors =require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// Use environment variables with fallbacks for local development
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const JWT_SECRET = process.env.JWT_SECRET;
// --- Changes End ---

// Middleware
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ====== Schemas & Models ====== //
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  role: { type: String, enum: ["owner", "driver", "broker"], required: true },
});
const User = mongoose.model("User", userSchema);

const loadSchema = new mongoose.Schema({
  brokerNumber: String,
  source: String,
  destination: String,
  loadType: String,
  weight: String,
  date: String,
  price: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Load = mongoose.model("Load", loadSchema);

const vehicleSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  driver: { type: String },
  status: {
    type: String,
    enum: ["available", "under trip", "under repair"],
    default: "available",
  },
});
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

const tripSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  driverName: String,
  startLocation: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  distance: Number,
});
const Trip = mongoose.model("Trip", tripSchema);

const expenseSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  driverName: String,
  amount: Number,
  fuel: Number,
  toll: Number,
  food: Number,
  maintenance: Number,
  other: Number,
  expenseName: String,
  category: String,
  notes: String,
  expenseDate: Date,
  createdAt: { type: Date, default: Date.now },
});
const Expense = mongoose.model("Expense", expenseSchema);

const tripChecklistSchema = new mongoose.Schema({
  loadWeight: Number,
  loadType: String,
  source: String,
  destination: String,
  vehicleNumber: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const TripChecklist = mongoose.model("TripChecklist", tripChecklistSchema);

// ====== Middleware ====== //
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select(
      "email role number"
    );
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

const restrictToRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: `Access restricted to ${roles.join(" / ")}` });
  }
  next();
};

// ====== Auth Routes ====== //
app.post("/api/signup", async (req, res) => {
  const { email, password, number, role } = req.body;
  try {
    if (!["owner", "driver", "broker"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ email, password, number, role });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email, role: user.role, number: user.number },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ====== Load Routes ====== //
app.post(
  "/api/post-load",
  authenticateToken,
  restrictToRole(["broker"]),
  async (req, res) => {
    try {
      const newLoad = new Load({ ...req.body, postedBy: req.user._id });
      await newLoad.save();
      res
        .status(201)
        .json({ message: "Load posted successfully", load: newLoad });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to post load", error: err.message });
    }
  }
);

app.get(
  "/api/loads",
  authenticateToken,
  restrictToRole(["owner", "broker"]),
  async (req, res) => {
    try {
      const loads = await Load.find().populate("postedBy", "email number");
      res.status(200).json(loads);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch loads", error: err.message });
    }
  }
);

// Get loads posted by a specific broker
app.get(
  "/api/loads/broker/:brokerId",
  authenticateToken,
  restrictToRole(["broker"]),
  async (req, res) => {
    try {
      const { brokerId } = req.params;
      const loads = await Load.find({ postedBy: brokerId }).populate("postedBy", "email number");
      res.status(200).json(loads);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch broker loads", error: err.message });
    }
  }
);

// Get a specific load by ID
app.get(
  "/api/loads/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const load = await Load.findById(req.params.id).populate("postedBy", "email number");
      if (!load) {
        return res.status(404).json({ message: "Load not found" });
      }
      res.status(200).json(load);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch load", error: err.message });
    }
  }
);

// Update a load
app.put(
  "/api/loads/:id",
  authenticateToken,
  restrictToRole(["broker"]),
  async (req, res) => {
    try {
      const load = await Load.findById(req.params.id);
      if (!load) {
        return res.status(404).json({ message: "Load not found" });
      }

      // Ensure the broker can only edit their own loads
      if (load.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to edit this load" });
      }

      const updatedLoad = await Load.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate("postedBy", "email number");

      res.status(200).json({ message: "Load updated successfully", load: updatedLoad });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update load", error: err.message });
    }
  }
);

// Delete a load
app.delete(
  "/api/loads/:id",
  authenticateToken,
  restrictToRole(["broker"]),
  async (req, res) => {
    try {
      const load = await Load.findById(req.params.id);
      if (!load) {
        return res.status(404).json({ message: "Load not found" });
      }

      // Ensure the broker can only delete their own loads
      if (load.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this load" });
      }

      await Load.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Load deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to delete load", error: err.message });
    }
  }
);

app.get("/api/brokers", authenticateToken, async (req, res) => {
  try {
    const brokers = await User.find({ role: "broker" }).select("email number");
    res.status(200).json(brokers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching brokers", error: err.message });
  }
});

// ====== Vehicle Routes ====== //
app.post(
  "/api/vehicles",
  authenticateToken,
  restrictToRole(["owner"]),
  async (req, res) => {
    try {
      const { number, type, capacity, driver } = req.body;
      const newVehicle = new Vehicle({ number, type, capacity, driver });
      await newVehicle.save();
      res
        .status(201)
        .json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error adding vehicle", error: err.message });
    }
  }
);

app.put(
  "/api/vehicles/:id/vehicle-status",
  authenticateToken,
  restrictToRole(["owner"]),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!vehicle)
        return res.status(404).json({ message: "Vehicle not found" });
      res.json({ message: "Vehicle status updated", vehicle });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

app.get(
  "/api/vehicles",
  authenticateToken,
  restrictToRole(["owner"]),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json(vehicles);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching vehicles", error: err.message });
    }
  }
);

// ====== Trip Routes ====== //
app.post(
  "/api/plan-trip",
  authenticateToken,
  restrictToRole(["owner"]),
  async (req, res) => {
    try {
      const trip = new Trip(req.body);
      await trip.save();
      res.json({ message: "Trip planned successfully", trip });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to plan trip", error: err.message });
    }
  }
);

app.get(
  "/api/trips",
  authenticateToken,
  restrictToRole(["owner", "driver"]),
  async (req, res) => {
    try {
      const trips = await Trip.find()
        .sort({ startDate: -1 })
        .populate("vehicleId");
      res.json(trips);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch trips", error: err.message });
    }
  }
);

// ====== Expense Routes ====== //
app.post(
  "/api/expense-log",
  authenticateToken,
  restrictToRole(["owner", "driver"]),
  async (req, res) => {
    try {
      const {
        vehicleNumber,
        driverName,
        amount,
        expenseName,
        category,
        date,
        notes,
        tripId,
      } = req.body;

      if (!category)
        return res.status(400).json({ message: "Category is required" });

      let fuel = 0;
      let toll = 0;
      let food = 0;
      let maintenance = 0;
      let other = 0;

      const parsedAmount = Number(amount) || 0;

      switch (category) {
        case "Fuel":
          fuel = parsedAmount;
          break;
        case "Toll":
          toll = parsedAmount;
          break;
        case "Food":
          food = parsedAmount;
          break;
        case "Maintenance":
          maintenance = parsedAmount;
          break;
        case "Other":
          other = parsedAmount;
          break;
        default:
          return res.status(400).json({ message: "Invalid category" });
      }

      const totalAmount = fuel + toll + food + maintenance + other;

      let vehicleId;
      if (vehicleNumber) {
        const vehicle = await Vehicle.findOne({ number: vehicleNumber });
        if (!vehicle)
          return res.status(400).json({ message: "Invalid vehicle number" });
        vehicleId = vehicle._id;
      }

      // If trip exists, fetch driver name and vehicle if not provided
      if (tripId) {
        const trip = await Trip.findById(tripId).populate("vehicleId");
        if (!trip) return res.status(400).json({ message: "Invalid trip ID" });
        if (!driverName) driverName = trip.driverName;
        if (!vehicleId) vehicleId = trip.vehicleId?._id;
      }

      const expense = new Expense({
        vehicleId,
        tripId,
        driverName,
        fuel,
        toll,
        food,
        maintenance,
        other,
        amount: totalAmount,
        expenseName,
        category,
        notes,
        expenseDate: date ? new Date(date) : undefined,
      });

      await expense.save();
      res.json({ message: "Expense logged successfully", expense });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to log expense", error: err.message });
    }
  }
);

app.get(
  "/api/expense-log",
  authenticateToken,
  restrictToRole(["owner", "driver"]),
  async (req, res) => {
    try {
      const expenses = await Expense.find()
        .sort({ createdAt: -1 })
        .populate("vehicleId tripId");

      const transformed = expenses.map((exp) => ({
        vehicleNumber: exp.vehicleId?.number || "N/A",
        driverName: exp.driverName || exp.tripId?.driverName || "N/A",
        tripDate: exp.tripId?.startDate
          ? new Date(exp.tripId.startDate).toLocaleDateString()
          : "N/A",
        fuel: exp.fuel || 0,
        toll: exp.toll || 0,
        food: exp.food || 0,
        maintenance: exp.maintenance || 0,
        other: exp.other || 0,
        amount: exp.amount || 0,
        expenseName: exp.expenseName || "N/A",
        category: exp.category || "N/A",
        notes: exp.notes || "N/A",
        expenseDate: exp.expenseDate
          ? new Date(exp.expenseDate).toLocaleDateString()
          : "N/A",
        createdAt: exp.createdAt,
      }));

      res.json(transformed);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch expenses", error: err.message });
    }
  }
);
// ====== Trip Checklist Routes ====== //
app.post(
  "/api/trip-checklist",
  authenticateToken,
  restrictToRole(["owner", "driver"]),
  async (req, res) => {
    try {
      const checklist = new TripChecklist({
        ...req.body,
        postedBy: req.user._id,
      });
      await checklist.save();
      res.json({ message: "Trip checklist submitted successfully", checklist });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Failed to submit trip checklist",
          error: err.message,
        });
    }
  }
);

app.get(
  "/api/trip-checklist",
  authenticateToken,
  restrictToRole(["owner", "driver"]),
  async (req, res) => {
    try {
      const checklists = await TripChecklist.find()
        .sort({ createdAt: -1 })
        .populate("postedBy", "email number");
      res.json(checklists);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch checklists", error: err.message });
    }
  }
);

// ====== Global Error Middleware ====== //
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// ====== Start Server ====== //
const server = app.listen(PORT, () => {
  console.log(`🚚 Lorry Tracker API running at http://localhost:${PORT}`);
});

// ====== Graceful Shutdown ====== //
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});