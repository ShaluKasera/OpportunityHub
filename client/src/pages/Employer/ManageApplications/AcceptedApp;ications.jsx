import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import { Button } from "react-bootstrap";

const AcceptedApplications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/employer/accepted-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <Box px={{ xs: 2, md: 10 }} py={4}>
      <p className="!text-2xl text-red-700 md:!text-4xl Yusei_Magic font-extrabold mb-0">
        All Accepted Applications
      </p>
      <div className="h-[1px] mt-4 mb-4 bg-red-700" />

      <Box
        sx={{
          overflowX: "auto",
          display: "flex",
          gap: 2,
          paddingBottom: 2,
        }}
      >
        {applications.map((app, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 300,
              flex: "0 0 auto",
            }}
            elevation={3}
          >
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Avatar
                  src="https://randomuser.me/api/portraits/lego/3.jpg"
                  alt="Seeker"
                  sx={{ width: 48, height: 48 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {app.createdAt
                    ? format(new Date(app.createdAt), "dd MMM yyyy")
                    : "N/A"}
                </Typography>
              </Box>

              <Typography variant="h6" mt={2} fontWeight="bold" color="error">
                {app.job?.title || "No Title"}
              </Typography>

              <Typography variant="subtitle1" mt={1}>
                {app.jobSeeker?.user?.name || "No Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {app.jobSeeker?.user?.email || "No Email"}
              </Typography>

              <Typography variant="body2" mt={1}>
                <strong>Domain:</strong> {app.jobSeeker?.domain || "N/A"}
              </Typography>

              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {app.jobSeeker?.skills?.map((skill, i) => (
                  <Chip label={skill} key={i} variant="outlined" />
                ))}
              </Box>

              <Button
                variant="outline-danger"
                className="w-full mt-2"
                onClick={() =>
                  navigate(`/application-detail/${app.id}`, {
                    state: app,
                  })
                }
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default AcceptedApplications;
