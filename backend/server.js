require('dotenv').config(); // Loads variables from .env file into process.env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// Use environment variables with fallbacks for local development
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://gadiyamshanmukhay:03012005@cluster0.cpfsb3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "your-default-jwt-secret";

const allowedOrigins = [
    'https://lorry-tracker.onrender.com', // 👈 CHANGE THIS
    'http://localhost:3000' // For your local testing
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driverName: String,
  startLocation: String,
  destination: String,
  startDate: { type: Date, required: true },
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
  if (!req.user || !roles.includes(req.user.role)) {
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
      user: { _id: user._id, email: user.email, role: user.role, number: user.number },
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
        const { vehicleNumber, departureDate, ...tripDetails } = req.body;
        const vehicle = await Vehicle.findOne({ number: vehicleNumber });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }
        const trip = new Trip({ 
            ...tripDetails, 
            vehicleId: vehicle._id, 
            startDate: new Date(departureDate) 
        });
        await trip.save();
        res.status(201).json({ message: "Trip planned successfully", trip });
    } catch (err) {
        console.error("Failed to plan trip:", err);
        res.status(500).json({ message: "Failed to plan trip", error: err.message });
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

app.get("/api/trips/total-expense", authenticateToken, async (req, res) => {
  try {
    const { vehicleNumber, tripDate } = req.query;

    if (!vehicleNumber || !tripDate) {
      return res.status(400).json({ message: "Vehicle number and trip date are required." });
    }

    const vehicle = await Vehicle.findOne({ number: vehicleNumber });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const tripStartDate = new Date(tripDate);
    tripStartDate.setUTCHours(0, 0, 0, 0);
    const tripEndDate = new Date(tripDate);
    tripEndDate.setUTCHours(23, 59, 59, 999);

    const trip = await Trip.findOne({
      vehicleId: vehicle._id,
      startDate: {
        $gte: tripStartDate,
        $lte: tripEndDate,
      },
    });

    if (!trip) {
      return res.status(200).json({ total: 0, message: "No trip found for the given vehicle and date." });
    }

    const expenses = await Expense.find({ tripId: trip._id });
    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    res.status(200).json({ total: totalExpense });

  } catch (err) {
    console.error("Error fetching total expense:", err);
    res.status(500).json({ message: "Server error while fetching total expense.", error: err.message });
  }
});


// ====== Expense Routes ====== //
/**
 * ✅ FIXED: This route now correctly links an expense to a trip.
 */
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
      } = req.body;

      if (!vehicleNumber || !amount || !category) {
        return res.status(400).json({ message: "Vehicle number, amount, and category are required" });
      }

      // 1. Find the vehicle to get its ID
      const vehicle = await Vehicle.findOne({ number: vehicleNumber });
      if (!vehicle) {
        return res.status(404).json({ message: "Invalid vehicle number" });
      }

      // 2. Find the trip this expense belongs to
      const expenseDate = date ? new Date(date) : new Date();
      const correspondingTrip = await Trip.findOne({
        vehicleId: vehicle._id,
        startDate: { $lte: expenseDate },
        $or: [
          { endDate: { $exists: false } }, // Trip is ongoing
          { endDate: null },               // Trip endDate is not set
          { endDate: { $gte: expenseDate } } // Or expense is within trip dates
        ],
      }).sort({ startDate: -1 }); // Get the most recent trip if there are overlaps

      if (!correspondingTrip) {
        return res.status(404).json({ message: "Could not find an active trip for this vehicle on the specified date." });
      }
      
      // 3. Create the expense with the crucial `tripId` link
      const parsedAmount = Number(amount) || 0;
      const expense = new Expense({
        vehicleId: vehicle._id,
        tripId: correspondingTrip._id, // ✅ This is the critical fix
        driverName,
        amount: parsedAmount,
        expenseName,
        category,
        notes,
        expenseDate,
      });

      await expense.save();
      res.status(201).json({ message: "Expense logged and linked to trip successfully", expense });
    } catch (err) {
      console.error("Failed to log expense:", err);
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
  console.error(err.stack); // Log the full error for debugging
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
