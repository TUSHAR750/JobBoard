const express = require("express");
const router = express.Router();
const cors = require("cors");
const Job = require("../models/Job");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin123";


app.use(cors({
  origin: "https://deft-sunburst-1ccb5e.netlify.app",
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));

app.use(express.json());

// your routes
app.get("/api/jobs", (req, res) => {
  res.json([...]); // your jobs data
});

// 🔐 Middleware
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// POST new job (admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE job (admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// POST new job (admin only)
router.post("/", async (req, res) => {
  if (req.headers.authorization !== ADMIN_TOKEN)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a job (admin only)
router.delete("/:id", async (req, res) => {
  if (req.headers.authorization !== ADMIN_TOKEN)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
