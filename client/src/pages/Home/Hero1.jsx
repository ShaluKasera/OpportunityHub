import React, { useEffect, useState } from "react";
import Cards from "../Jobs/Cards";

const Hero1 = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [jobs, setJobs] = useState([]);

  // Fetch jobs
  const fetchJobs = async (title = "") => {
    try {
      const response = await fetch(
        title
          ? `${import.meta.env.VITE_BASE_URL}/user/all-jobs?title=${title}`
          : `${import.meta.env.VITE_BASE_URL}/user/all-jobs?limit=4`
      );
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = () => {
    if (searchTitle.trim() === "") {
      fetchJobs();
    } else {
      fetchJobs(searchTitle.trim());
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-black py-20 px-4 text-center">
        <p className="text-2xl md:text-4xl Yusei_Magic font-extrabold mb-4">
          Find Your Next <span className="text-red-700">Opportunity</span>
        </p>
        <p className="text-lg md:text-l mb-6 font-bold Ysabeau_Infant">
          Explore thousands of job listings and land your dream role today.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center max-w-xl mx-auto">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="rounded-l-full px-4 py-2 w-full border Ysabeau_Infant text-black focus:outline-none focus:ring-1 focus:ring-red-700"
            placeholder="Find your dream job..."
          />
          <button
            onClick={handleSearch}
            className="!rounded-r-full px-6 py-0.5 border-2 border-red-600 bg-red-700 text-white Ysabeau_Infant font-semibold hover:bg-white hover:!text-red-700 hover:border-2 hover:border-red-600 duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <p className="text-2xl md:text-4xl font-semibold Ysabeau_Infant mb-6">
          {searchTitle ? "Search Results" : "Latest & top"}{" "}
          <span className="text-red-700">Job Openings</span>
        </p>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <Cards key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 animate-fadeIn text-center text-gray-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
              alt="No Jobs"
              className="w-32 h-32 mb-4 opacity-80"
            />
            <h2 className="text-xl font-semibold">No matching jobs found</h2>
            <p className="text-sm mt-1 text-gray-500">
              We couldn’t find anything for your search. Try some different
              related your Domain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero1;
