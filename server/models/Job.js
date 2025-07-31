const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  passout: [Number], // ✅ match Admin form (array of numbers)
  jobField: String,
  description: String,
  experience: String, // ✅ now added
  lastDateToApply: String, // ✅ now added
  link: String, // ✅ now added
  type: { type: String, default: "Full-Time" }, // optional fallback
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);
