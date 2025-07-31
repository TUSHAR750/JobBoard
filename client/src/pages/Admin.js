import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Admin = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    passout: "",
    link: "",
    experience: "",
    lastDateToApply: "",
    jobField: "",
  });

  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Use REACT_APP_ADMIN_TOKEN for security and consistency
  const ADMIN_TOKEN = process.env.REACT_APP_ADMIN_TOKEN || "admin123";
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const fetchJobs = useCallback(() => {
    axios
      .get(`${BASE_URL}/api/jobs`)
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err));
  }, [BASE_URL]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [fetchJobs, isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/jobs`,
        {
          ...form,
          passout: form.passout.split(",").map(Number),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchJobs(); // ✅ refresh jobs after submission
      setForm({
        title: "",
        company: "",
        location: "",
        passout: "",
        link: "",
        experience: "",
        lastDateToApply: "",
        jobField: "",
      });
    } catch (error) {
      console.error("Failed to submit job", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/jobs/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      fetchJobs(); // ✅ refresh after deletion
    } catch (error) {
      console.error("Failed to delete job", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Enter Admin Token</h1>
        <input
          type="password"
          className="w-64 p-2 mb-4 border rounded"
          placeholder="Enter Admin Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded"
          onClick={() => {
            if (token === ADMIN_TOKEN) {
              setIsAuthenticated(true);
            } else {
              alert("Invalid token");
              setToken("");
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold text-center">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="max-w-xl px-4 mx-auto mb-8 space-y-2">
        {["title", "company", "location", "link", "experience", "lastDateToApply"].map(
          (field) => (
            <input
              key={field}
              className="w-full p-2 border rounded"
              placeholder={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          )
        )}

        <select
          className="w-full p-2 border rounded"
          name="passout"
          value={form.passout}
          onChange={handleChange}
          required
        >
          <option value="">Select Passout Year</option>
          {[2026, 2025, 2024, 2023, 2022].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border rounded"
          name="jobField"
          value={form.jobField}
          onChange={handleChange}
          required
        >
          <option value="">Select Field</option>
          <option value="Software Developer">Software Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="HR">HR</option>
          <option value="QA/Testing">QA/Testing</option>
          <option value="UI/UX Designer">UI/UX Designer</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="Other">Other</option>
        </select>

        <button className="px-4 py-2 text-white bg-blue-600 rounded">
          Add Job
        </button>
      </form>

      <h2 className="px-4 mb-2 text-xl font-semibold">Existing Jobs</h2>
      <div className="px-4">
        {jobs.map((job) => (
          <div key={job._id} className="p-4 mb-2 bg-white border rounded shadow">
            <div className="font-semibold">{job.title}</div>
            <div className="text-sm text-gray-500">{job.company}</div>
            <button
              className="mt-2 text-sm text-red-500"
              onClick={() => handleDelete(job._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
