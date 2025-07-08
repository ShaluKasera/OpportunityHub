import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { BsCloudUpload } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import Loading from "../../components/Loading";

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
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const pathname = window.location.pathname;
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePic: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
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
      const formPayload = new FormData();

      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }
      const response = await axios.post("/seeker/signup", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success(response?.data?.message || "Registered successfully",{id: `success-${pathname}`});

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
        profilePic: null,
      });
      setProfilePreview(null);

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 1500);
    } catch (error) {
      console.log("Signup Error: ", error);
    } finally {
      setIsSubmitting(false);
      setProfilePreview(null);
    }
  };

  return (
    <Form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-3xl !font-bold mb-4 Ysabeau_Infant">
        Job Seeker Registration
      </h2>

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
        <input
          accept="image/*"
          id="profilePic"
          type="file"
          name="profilePic"
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <label htmlFor="profilePic">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
              border: "2px dashed #ccc",
              borderRadius: "5px",
              padding: "10px",
              cursor: "pointer",
              mt: 1,
              "&:hover": {
                borderColor: "red",
              },
            }}
          >
            <BsCloudUpload className="text-2xl text-gray-400" />
            <Typography variant="body2" color="textSecondary">
              Click or drag file to upload Profile pic
            </Typography>
          </Box>
        </label>

        {profilePreview && (
          <Box mt={2}>
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
        type="submit"
        className="!w-full mt-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loading /> : "Register as Job Seeker"}
      </Button>
    </Form>
  );
};

export default SeekerSignup;
