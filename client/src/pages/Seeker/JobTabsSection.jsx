import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobTabsSection = ({
  appliedJobs = [],
  jobOffers = [],
  appliedJobsLoading,
  jobOffersLoading,
  handleViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState("applied");

  const jobsToDisplay = activeTab === "applied" ? appliedJobs : jobOffers;
  const isLoading =
    activeTab === "applied" ? appliedJobsLoading : jobOffersLoading;

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

      {isLoading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobsToDisplay.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobsToDisplay.map((job) => (
            <li
              key={job.id}
              className="p-4 border border-gray-200 rounded hover:shadow transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <Link
                  to={
                    activeTab === "applied"
                      ? `/applied-job-details/${job.id}`
                      : `/offered-job-details/${job.jobOfferId}`
                  }
                  className="!no-underline !text-red-700 border-2 border-red-700 py-2 rounded-xl hover:bg-red-700 px-4 hover:!text-white transition-all duration-700 Ysabeau_Infant font-bold text-xl"
                >
                  View Details
                </Link>
                 
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default JobTabsSection;
