const express = require("express");
const router = express.Router();
const Job = require("../models/Job"); // ✅ use this import
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin123";

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
  console.log("📥 Received job data:", req.body);
  try {
    const job = await Job.create(req.body); // ✅ Fixed!
    res.json(job);
  } catch (err) {
    console.error("🔥 Error in POST /api/jobs:", err.message);
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

module.exports = router;
