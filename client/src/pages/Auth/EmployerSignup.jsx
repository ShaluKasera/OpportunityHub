import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading";

const EmployerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    companyLogoUrl: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyLogoUrl") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, companyLogoUrl: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
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
      const formPayload = new FormData();

      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }

      const response = await axios.post("/employer/signup", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        companyName: "",
        companySize: "",
        industry: "",
        location: "",
        description: "",
        companyLogoUrl: null,
      });

      setLogoPreview(null);

      toast.success(response?.data?.message || "Registered successfully!");

      setTimeout(() => {
        navigate("/verify-email", { state: { email: formData.email } });
      }, 2000);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-3xl !font-bold mb-4 Ysabeau_Infant">
          Employer Registration
        </h2>

        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          margin="normal"
          color="error"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
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
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          margin="normal"
          color="error"
          required
        />

        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          margin="normal"
          color="error"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel color="error">Company Size</InputLabel>
          <Select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
            label="Company Size"
            required
            color="error"
            sx={{
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
                "&.Mui-selected": {
                  backgroundColor: "red",
                  color: "white",
                },
              },
            }}
          >
            <MenuItem value="">Select company size</MenuItem>
            <MenuItem value="1-10">1-10</MenuItem>
            <MenuItem value="11-50">11-50</MenuItem>
            <MenuItem value="51-200">51-200</MenuItem>
            <MenuItem value="201-500">201-500</MenuItem>
            <MenuItem value="500+">500+</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. Tech, Finance, Healthcare"
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
          placeholder="Enter location"
          margin="normal"
          required
          color="error"
        />

        <TextField
          fullWidth
          label="Company Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your company"
          margin="normal"
          required
          color="error"
        />

        <Form.Group>
          <Form.Label>Company Logo</Form.Label>
          <Form.Control
            type="file"
            name="companyLogoUrl"
            accept="image/*"
            color="error"
            onChange={handleChange}
          />
          {logoPreview && (
            <div className="mt-2">
              <img
                src={logoPreview}
                alt="Company Logo Preview"
                className="h-20 object-contain"
              />
            </div>
          )}
        </Form.Group>
        {isSubmitting ? (
          <Loading color="danger" />
        ) : (
          <Button
            variant="outline-danger"
            type="submit"
            className="w-full mt-3"
            disabled={isSubmitting}
          >
            Register as Employer
          </Button>
        )}
      </Form>
    </div>
  );
};

export default EmployerSignup;
