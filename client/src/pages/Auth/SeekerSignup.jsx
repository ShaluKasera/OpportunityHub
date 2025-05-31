import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        "http://localhost:8000/api/seeker/signup",
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

      alert(response.data.message);
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
      <Form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-3xl !font-bold mb-4 Ysabeau_Infant">
          Job Seeker Registration
        </p>

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
          <Form.Label>Domain</Form.Label>
          <Form.Control
            type="text"
            name="domain"
            placeholder="e.g. Web Development, Data Science"
            value={formData.domain}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Experience (Years)</Form.Label>
          <Form.Control
            type="number"
            name="experienceYears"
            placeholder="e.g. 2"
            value={formData.experienceYears}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Skills</Form.Label>
          <Form.Control
            type="text"
            name="skills"
            placeholder="e.g. React, Node.js, Python"
            value={formData.skills}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Resume URL</Form.Label>
          <Form.Control
            type="url"
            name="resumeUrl"
            placeholder="Link to your resume (Google Drive, etc.)"
            value={formData.resumeUrl}
            onChange={handleChange}
            className="!placeholder-gray-400"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleChange}
          />
          {profilePreview && (
            <div className="mt-2">
              <img
                src={profilePreview}
                alt="Profile Preview"
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
          {isSubmitting ? "Registering..." : "Register as Job Seeker"}
        </Button>
      </Form>
    </div>
  );
};

export default SeekerSignup;
