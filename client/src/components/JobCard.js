function JobCard({ job }) {
  return (
    <div className="p-6 mb-6 transition duration-300 ease-in-out bg-white border shadow-md rounded-2xl hover:shadow-xl">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
          {job.type}
        </span>
      </div>

      <p className="font-medium text-gray-700">{job.company}</p>
      <p className="mb-2 text-gray-600">{job.location}</p>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
        <p><span className="font-semibold">Experience:</span> {job.experience} years</p>
        <p><span className="font-semibold">Last Date:</span> {job.lastDateToApply}</p>
        <p><span className="font-semibold">Field:</span> {job.jobField}</p>
        <p>
          <span className="font-semibold">Eligible Passouts:</span>{" "}
          {Array.isArray(job.passout)
            ? job.passout.join(", ")
            : typeof job.passout === "string"
            ? job.passout
            : "All"}
        </p>
      </div>

      <p className="mb-4 text-sm text-gray-700">{job.description}</p>

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-2 font-semibold text-center text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
        >
          Apply Now
        </a>
      )}
    </div>
  );
}

export default JobCard;
