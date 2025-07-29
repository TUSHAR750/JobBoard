const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ["https://deft-sunburst-1ccb5e.netlify.app"]
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB outside request handlers
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "admin123") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Job model
const Job = mongoose.model("Job", new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  passout: Number,
  link: String,
  description: String,
  experience: String,
  lastDateToApply: String,
  jobField: String,
}, { timestamps: true }));

// Routes
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.post("/api/jobs", verifyAdminToken, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to add job" });
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

// ❌ DO NOT use app.listen()
// ✅ Export app for Vercel
module.exports = app;
