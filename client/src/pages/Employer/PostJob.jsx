import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  MenuItem,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    openings: "",
    location: "",
    salary: "",
    domain: "",
    experienceRequired: "",
    jobType: "full-time",
    deadline: "",
    skills: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        openings: Number(formData.openings),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      const response = await axios.post(
        "http://localhost:8000/api/employer/post-job",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      

      setFormData({
        title: "",
        description: "",
        openings: "",
        location: "",
        salary: "",
        domain: "",
        experienceRequired: "",
        jobType: "full-time",
        deadline: "",
        skills: "",
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      alert(response.data.message);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      console.error("Post job error:", error.response?.data || error.message);
      alert(serverMessage || "There was an error posting the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        px={2}
        py={4}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 600 }}
        >
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
              Post a New Job
            </Typography>
            <form onSubmit={handleSubmit}>
              {[
                { name: "title", label: "Job Title" },
                { name: "description", label: "Job Description", multiline: true },
                { name: "openings", label: "Openings", type: "number" },
                { name: "location", label: "Location" },
                { name: "salary", label: "Salary (e.g. $100/month)" },
                { name: "domain", label: "Domain (e.g. Web Dev)" },
                { name: "experienceRequired", label: "Experience Required" },
                { name: "deadline", label: "Deadline", type: "date" },
                { name: "skills", label: "Required Skills (comma separated)" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  multiline={field.multiline || false}
                  rows={field.multiline ? 3 : 1}
                  margin="normal"
                  color="error"
                  required={["title", "description", "domain","openings","location","salary","domain","experienceRequired","skills"].includes(field.name)}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : undefined
                  }
                />
              ))}

              <TextField
                select
                fullWidth
                name="jobType"
                label="Job Type"
                value={formData.jobType}
                onChange={handleChange}
                margin="normal"
                color="error"
                requ
              >
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>

              <Box mt={3} textAlign="center">
                <Button
                  variant="outline-danger"
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Post Job"}
                </Button>
              </Box>

              <Fade in={submitted}>
                <Typography
                  mt={2}
                  variant="body1"
                  align="center"
                  color="success.main"
                >
                  Job posted successfully!
                </Typography>
              </Fade>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Layout>
  );
};

export default PostJob;
