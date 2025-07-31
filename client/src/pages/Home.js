import { useEffect, useState , useCallback } from "react";
import axios from "axios";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [passoutFilter, setPassoutFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;



const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/jobs`);
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  }, [BASE_URL]); // ✅ No ESLint warning now

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);


  const filteredJobs = jobs.filter((job) => {
    return (
      (passoutFilter === "" || job.passout.includes(Number(passoutFilter))) &&
      (fieldFilter === "" || job.jobField === fieldFilter) &&
      (experienceFilter === "" || Number(job.experience) >= Number(experienceFilter))
    );
  });

  return (
    <div className="flex items-start justify-center min-h-screen px-4 py-10 bg-gray-100">
      <div className="w-full max-w-6xl">
        {/* Filters */}
        <div className="flex flex-col justify-center gap-4 mb-8 md:flex-row">
          <select
            className="w-full p-2 border rounded-md md:w-60"
            value={passoutFilter}
            onChange={(e) => setPassoutFilter(e.target.value)}
          >
            <option value="">All Passout Years</option>
            {[2026, 2025, 2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded-md md:w-60"
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
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

          <select
            className="w-full p-2 border rounded-md md:w-60"
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
          >
            <option value="">All Experience Levels</option>
            <option value="0">0 Years</option>
            <option value="1">1+ Years</option>
            <option value="2">2+ Years</option>
            <option value="3">3+ Years</option>
            <option value="4">4+ Years</option>
            <option value="5">5+ Years</option>
            <option value="6">6+ Years</option>
            <option value="7">7+ Years</option>
            <option value="8">8+ Years</option>
            <option value="9">9+ Years</option>
            <option value="10">10+ Years</option>
          </select>

        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="relative p-5 transition duration-300 bg-white border shadow-lg rounded-xl hover:shadow-xl"
            >
              <h2 className="mb-1 text-xl font-bold text-blue-800">{job.title}</h2>
              <p className="text-sm font-medium text-gray-700">{job.company}</p>
              <p className="mb-2 text-sm text-gray-600">{job.location}</p>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                  Min Exp: {job.experience ? `${job.experience} yrs` : "N/A"}
                </span>
                <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                  Field: {job.jobField}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Passout Year:{" "}
                {Array.isArray(job.passout)
                  ? job.passout.join(", ")
                  : typeof job.passout === "string"
                  ? job.passout
                  : "All"}
              </p>

              <p className="text-sm text-gray-500">
                Last Date: {job.lastDateToApply || "N/A"}
              </p>

              {/* <p className="mt-2 text-sm text-gray-800 line-clamp-4">{job.description}</p> */}

              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 mt-4 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Apply Now
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
