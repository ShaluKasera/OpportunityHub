import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    companyLogo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyLogo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, companyLogo: file }));
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
      const {
        name,
        email,
        password,
        phone,
        companyName,
        companySize,
        industry,
        location,
        description,
      } = formData;

      const dataToSend = {
        name,
        email,
        password,
        phone,
        companyName,
        companySize,
        industry,
        location,
        description,
      };

      const response = await axios.post(
        "http://localhost:8000/api/employer/signup",
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
        companyName: "",
        companySize: "",
        industry: "",
        location: "",
        description: "",
        companyLogo: null,
      });
      setLogoPreview(null);

      alert(response.data.message);
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 2000);
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      console.error("Signup error:", error.response?.data || error.message);
      alert(serverMessage || "Signup failed");

      if (serverMessage === "User already exists") {
        setTimeout(() => {
          navigate("/verify-email", { state: { email: formData.email } });
        }, 500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit} className="space-y-4 ">
        <h2 className="text-3xl !font-bold mb-4 Ysabeau_Infant">
          Employer Registration
        </h2>

        <Form.Group>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <div className="relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="!placeholder-gray-400"
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-sm text-blue-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </Form.Group>

        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Company Size</Form.Label>
          <Form.Control
            type="text"
            name="companySize"
            placeholder="e.g. 1-10, 11-50, 100+"
            value={formData.companySize}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Industry</Form.Label>
          <Form.Control
            type="text"
            name="industry"
            placeholder="e.g. Tech, Finance, Healthcare"
            value={formData.industry}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Company Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            placeholder="Brief description of your company"
            value={formData.description}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Company Logo</Form.Label>
          <Form.Control
            type="file"
            name="companyLogo"
            accept="image/*"
            onChange={handleChange}
            className="!placeholder-gray-400"
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

        <Button
          variant="outline-danger"
          type="submit"
          className="w-full mt-3"
          disabled={isSubmitting} // disable button while submitting
        >
          {isSubmitting ? "Registering..." : "Register as Employer"}
        </Button>
      </Form>
    </div>
  );
};

export default EmployerSignup;
