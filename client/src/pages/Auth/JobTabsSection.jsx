import React, { useState } from "react";

const JobTabsSection = ({ appliedJobs = [], jobOffers = [], handleViewDetails }) => {
  const [activeTab, setActiveTab] = useState("applied");

  const jobsToDisplay = activeTab === "applied" ? appliedJobs : jobOffers;

  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <div className="flex space-x-4 border-b gap-4 border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("applied")}
          className={`pb-2 font-semibold text-sm ${
            activeTab === "applied"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-500"
          }`}
        >
          Applied Jobs
        </button>
        <button
          onClick={() => setActiveTab("offers")}
          className={`pb-2 font-semibold text-sm ${
            activeTab === "offers"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-500"
          }`}
        >
          Job Offers
        </button>
      </div>

      <ul className="space-y-4">
        {jobsToDisplay.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          jobsToDisplay.map((job) => (
            <li
              key={job.id}
              className="p-4 border border-gray-200 rounded hover:shadow transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(job)}
                  className="text-sm text-red-700 border-2 border-red-700 hover:bg-red-700 px-4 py-2 !rounded-2xl hover:text-white font-bold transition-all duration-500"
                >
                  View Details
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

export default JobTabsSection;
