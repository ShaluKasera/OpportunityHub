import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "./Cards";
import { Box, Typography } from "@mui/material";

const PostedJobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/employer/posted-joblist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Box px={{ xs: 2, md: 10 }} py={4}>
      {jobs.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No jobs posted yet.
        </Typography>
      ) : (
        <>
          <p className="!text-2xl text-red-700 md:!text-4xl Yusei_Magic font-extrabold mb-0">
            Your Posted Jobs
          </p>

          <div className="h-[1px] mt-4 mb-4 bg-red-700" />

          {/* Scrollable horizontal list */}
          <Box
            sx={{
              overflowX: "auto",
              display: "flex",
              gap: 2,
              pb: 2,
            }}
          >
            {jobs.map((job) => (
              <Box key={job.id} sx={{ minWidth: 300, flex: "0 0 auto" }}>
                <Cards job={job} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PostedJobList;
