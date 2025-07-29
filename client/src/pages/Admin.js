import { useEffect, useState } from "react";

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
  
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin123";
  // Keep this consistent with your App.js or use .env
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const getJobs = () => {
    fetch(`${REACT_APP_API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      getJobs();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${REACT_APP_API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        ...form,
        passout: form.passout.split(",").map(Number),
      }),
    });
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
    getJobs();
  };

  const handleDelete = async (id) => {
    await fetch(`${REACT_APP_API_URL}/api/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    getJobs();
  };

  // Token check screen
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

  // Admin panel after auth
  return (
    <div className="min-h-screen py-6 bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold text-center">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-2">
        {["title", "company", "location", "link", "experience", "lastDateToApply"].map(
          (field) => (
            <input
              key={field}
              className="w-full p-2 border"
              placeholder={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          )
        )}

        <select
          className="w-full p-2 border"
          name="passout"
          value={form.passout}
          onChange={handleChange}
          required
        >
          <option value="">All Passout Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
        </select>

        <select
          className="w-full p-2 border"
          name="jobField"
          value={form.jobField}
          onChange={handleChange}
          required
        >
          <option value="">All Fields</option>
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

      <h2 className="mb-2 text-xl font-semibold">Existing Jobs</h2>
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
  );
};

export default Admin;
