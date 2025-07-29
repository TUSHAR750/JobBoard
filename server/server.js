const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Body parser

const mongoURI = process.env.MONGO_URI;

// Sample admin token middleware
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'admin123') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Mongoose Job model
const Job = mongoose.model('Job', new mongoose.Schema({
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

// GET all jobs
app.get('/routes/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// POST new job
app.post('/routes/jobs', verifyAdminToken, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add job' });
  }
});

// DELETE job
app.delete('/routes/jobs/:id', verifyAdminToken, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Connect to MongoDB and start server
mongoose.connect(mongoURI)
  .then(() => app.listen(5000, () => console.log('Server running on http://localhost:5000')))
  .catch(err => console.error(err));
