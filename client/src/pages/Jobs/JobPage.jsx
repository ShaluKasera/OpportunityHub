import React, { useState, useEffect } from "react";
import axios from "axios";
import JobFilterSidebar from "./JobFilterSidebar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Layout from "../../components/Layout/Layout";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Cards from "./Cards";

const NAVBAR_HEIGHT = 64;

const JobPage = () => {
  const [filters, setFilters] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/api/user/all-jobs", {
        params: {
          ...filters,
          page,
          limit,
          minSalary: filters.salaryRange ? filters.salaryRange[0] : undefined,
          maxSalary: filters.salaryRange ? filters.salaryRange[1] : undefined,
        },
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError("Error fetching jobs from server");
    }

    setLoading(false);
  };

  // Fetch jobs when filters or page changes
  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setPage(1); // Reset to page 1 on filter change
    setShowSidebar(false);
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex">
        {!showSidebar && (
          <IconButton
            onClick={() => setShowSidebar(true)}
            className="fixed top-0 left-10 z-50 bg-white shadow-md border border-gray-300"
            sx={{
              top: NAVBAR_HEIGHT,
              width: 50,
              height: 50,
              padding: 1,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 w-72 min-h-screen bg-white shadow-md z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto`}
          style={{
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <JobFilterSidebar
              onFilterChange={handleFilterChange}
              onClose={() => setShowSidebar(false)}
            />
          </LocalizationProvider>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 p-6 transition-all duration-300 w-full"
          style={{
            paddingLeft: showSidebar ? 288 : 0,
            paddingTop: NAVBAR_HEIGHT,
          }}
        >
          <p className="text-5xl font-bold mb-6 text-center Ysabeau_Infant">
            Jobs List
          </p>

          {loading && <p className="text-center">Loading jobs...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-16 animate-fadeIn text-center text-gray-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="No Jobs"
                className="w-32 h-32 mb-4 opacity-80"
              />
              <h2 className="text-xl font-semibold">No jobs found</h2>
              <p className="text-sm mt-1 text-gray-500">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}

          <div
            className={`grid gap-6 px-4 ${
              showSidebar
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
            style={{ justifyContent: "center" }}
          >
            {jobs.map((job) => (
              <Cards key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobPage;
