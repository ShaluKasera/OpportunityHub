import React, { useState } from "react";
import {
  TextField,
  InputLabel,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const SeekerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    domain: "",
    location: "",
    experienceYears: "",
    skills: "",
    resumeUrl: "",
    profile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        name,
        email,
        password,
        phone,
        domain,
        location,
        experienceYears,
        skills,
        resumeUrl,
      } = formData;

      const dataToSend = {
        name,
        email,
        password,
        phone,
        domain,
        location,
        experienceYears,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        resumeUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/seeker/signup`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        domain: "",
        location: "",
        experienceYears: "",
        skills: "",
        resumeUrl: "",
        profile: null,
      });
      setProfilePreview(null);
      toast.success(response.data.message || "Registered successfully!");

      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 2000);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(serverMessage || "Registeration Failed!");


      if (serverMessage === "User already exists") {
        setTimeout(() => {
          navigate("/verify-email", { state: { email: formData.email } });
        }, 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
   
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", p: 3 }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Job Seeker Registration
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
        InputProps={{
          endAdornment: (
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                cursor: "pointer",
                color: "red",
                fontSize: "0.9em",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Domain"
        name="domain"
        placeholder="e.g. Web Development, Data Science"
        value={formData.domain}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Experience (Years)"
        type="number"
        name="experienceYears"
        value={formData.experienceYears}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Skills"
        name="skills"
        placeholder="e.g. React, Node.js, Python"
        value={formData.skills}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <TextField
        fullWidth
        label="Resume URL"
        type="url"
        name="resumeUrl"
        placeholder="Link to your resume"
        value={formData.resumeUrl}
        onChange={handleChange}
        margin="normal"
        color="error" 
        required
      />

      <Box mt={2}>
        <InputLabel>Profile Picture</InputLabel>
        <input
          type="file"
          name="profile"
          accept="image/*"
          color="error" 
          onChange={handleChange}
          style={{ marginTop: "8px" }}
        />
        {profilePreview && (
          <Box mt={1}>
            <img
              src={profilePreview}
              alt="Profile Preview"
              style={{ height: 80, objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>

      <Button
        variant="outline-danger"
        color="error"
        type="submit"
        className="!w-full mt-3"
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register as Job Seeker"}
      </Button>
    </Box>
     </div>
  );
};

export default SeekerSignup;
