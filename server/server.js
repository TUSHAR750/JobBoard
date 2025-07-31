require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobsRoute = require("./routes/jobs");

const app = express();

const cron = require("node-cron");
const Job = require("./models/Job");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const result = await Job.deleteMany({
      lastDateToApply: { $lt: today }
    });
    console.log(`🧹 Deleted ${result.deletedCount} expired jobs`);
  } catch (err) {
    console.error("🔥 Cron job error:", err);
  }
});

app.use(cors({
  origin: ["http://localhost:3000"]
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB outside request handlers
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "admin123") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};


const jobRoutes = require("./routes/jobs"); 

app.use("/api/jobs", jobRoutes);


// Routes
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    console.log("Received job data:", req.body);

    const job = new Job(req.body);  // ✅ FIXED: use Job, not JobModel
    await job.save();

    res.status(201).json({ message: "Job added successfully" });
  } catch (err) {
    console.error("🔥 Error in POST /api/jobs:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.delete("/api/jobs/:id", verifyAdminToken, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

