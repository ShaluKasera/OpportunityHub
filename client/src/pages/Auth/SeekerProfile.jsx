import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import JobTabsSection from "./JobTabsSection";

const SeekerProfile = () => {
  // seeker profile
  const [user, setUser] = useState({
    profilePic: "",
    name: "",
    email: "",
  });

  const [jobSeeker, setJobSeeker] = useState({
    domain: "",
    location: "",
    experienceYears: "",
    phone: "",
    skills: [],
    resumeUrl: "",
    availabilityStatus: "",
  });

  const [decoded, setDecoded] = useState(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isProfessionalEditOpen, setIsProfessionalEditOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      } catch (err) {
        console.error("Invalid token:", err);
      }

      const fetchProfile = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8000/api/seeker/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = res.data;
          const userData = data.user || {};

          setUser({
            name: userData.name,
            email: userData.email,
            profilePic:
              userData.profilePic ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          });

          setJobSeeker({
            domain: data.domain,
            location: data.location,
            experienceYears: data.experienceYears,
            phone: data.phone,
            skills: data.skills,
            resumeUrl: data.resumeUrl,
            availabilityStatus: data.availabilityStatus,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error.message);
        }
      };

      fetchProfile();
    }
  }, []);

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/seeker/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setJobSeeker((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const profileData = {
      name: user.name,
      phone: jobSeeker.phone,
      domain: jobSeeker.domain,
      experienceYears: jobSeeker.experienceYears,
      skills: jobSeeker.skills,
      location: jobSeeker.location,
      resumeUrl: jobSeeker.resumeUrl,
      availabilityStatus: jobSeeker.availabilityStatus,
    };

    updateProfile(profileData);
    setIsProfileEditOpen(false);
  };

  const handleSaveProfessionalDetail = (e) => {
    e.preventDefault();

    const profileData = {
      name: user.name,
      phone: jobSeeker.phone,
      domain: jobSeeker.domain,
      experienceYears: jobSeeker.experienceYears,
      skills: jobSeeker.skills,
      location: jobSeeker.location,
      resumeUrl: jobSeeker.resumeUrl,
      availabilityStatus: jobSeeker.availabilityStatus,
    };

    updateProfile(profileData);
    setIsProfessionalEditOpen(false);
  };

  // Jobsections
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobOffers, setJobOffers] = useState([]); // currently dummy or reused
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/seeker/all-applied-job",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const formattedJobs = res.data.applications.map((app) => ({
            id: app.job.id,
            title: app.job.title,
            company: app.job.domain || "Unknown Company",
          }));

          setAppliedJobs(formattedJobs);
          setJobOffers(formattedJobs); // Reusing for now
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleViewDetails = (job) => {
    console.log("Job details clicked:", job);
    // Navigate to details page or open modal
  };

  if (loading) return <p className="p-4 text-gray-600">Loading jobs...</p>;

  return (
    <>
      <div className="container py-6 max-w-4xl mx-auto space-y-10">
        {/* Profile Section */}
        <section className="relative bg-white p-6 rounded-xl border shadow">
          <p className="text-3xl font-bold mb-4">Profile</p>
          <button
            className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
            onClick={() => setIsProfileEditOpen(true)}
          >
            Edit
          </button>
          <div className="flex items-center space-x-10 px-6">
            <img
              src={user.profilePic}
              alt={`${user.name} profile`}
              className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
            />
            <div>
              <h2 className="text-2xl font-extrabold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{jobSeeker.location}</p>
            </div>
          </div>
        </section>

        {/* Professional Details Section */}
        <section className="relative bg-white p-6 rounded-xl border shadow space-y-2">
          <p className="text-3xl font-bold mb-4">Professional Details</p>
          <button
            className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
            onClick={() => setIsProfessionalEditOpen(true)}
          >
            Edit
          </button>
          <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
            <div>
              <span className="font-semibold">Domain:</span>{" "}
              {jobSeeker.domain || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Location:</span>{" "}
              {jobSeeker.location || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Experience:</span>{" "}
              {jobSeeker.experienceYears ?? "N/A"} years
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {jobSeeker.phone || "N/A"}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Skills:</span>{" "}
              {jobSeeker.skills?.join(", ") || "N/A"}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Resume:</span>{" "}
              <a
                href={jobSeeker.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700"
              >
                View Resume
              </a>
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Availability Status:</span>{" "}
              <span
                className={`font-semibold ${
                  jobSeeker.availabilityStatus === "available"
                    ? "text-green-600"
                    : jobSeeker.availabilityStatus === "employed"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {jobSeeker.availabilityStatus
                  ?.replace("_", " ")
                  .toUpperCase() || "N/A"}
              </span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="max-w-full border rounded-xl mx-auto mt-8">
          <JobTabsSection
            appliedJobs={appliedJobs}
            jobOffers={jobOffers}
            handleViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsProfileEditOpen(false)}
            >
              ×
            </button>
            <p className="text-2xl font-bold mb-4">Edit Profile</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="w-full border p-2 rounded"
              disabled
            />
            <input
              type="text"
              name="location"
              value={jobSeeker.location}
              onChange={handleProfessionalChange}
              placeholder="Location"
              className="w-full border p-2 rounded"
            />
            <Button
              variant="outline-danger"
              onClick={handleSaveProfile}
              className="w-full mt-4"
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Professional Edit Modal */}
      {isProfessionalEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsProfessionalEditOpen(false)}
            >
              ×
            </button>
            <p className="text-2xl font-bold mb-4">Edit Professional Details</p>
            <input
              type="text"
              name="phone"
              value={jobSeeker.phone}
              onChange={handleProfessionalChange}
              placeholder="Phone"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="domain"
              value={jobSeeker.domain}
              onChange={handleProfessionalChange}
              placeholder="Domain"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="experienceYears"
              value={jobSeeker.experienceYears}
              onChange={handleProfessionalChange}
              placeholder="Experience (Years)"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="skills"
              value={jobSeeker.skills}
              onChange={(e) =>
                setJobSeeker((prev) => ({
                  ...prev,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              placeholder="Skills (comma-separated)"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="resumeUrl"
              value={jobSeeker.resumeUrl}
              onChange={handleProfessionalChange}
              placeholder="Resume URL"
              className="w-full border p-2 rounded"
            />
            <select
              name="availabilityStatus"
              value={jobSeeker.availabilityStatus}
              onChange={handleProfessionalChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Availability</option>
              <option value="available">Available</option>
              <option value="employed">Employed</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <Button
              variant="outline-danger"
              onClick={handleSaveProfessionalDetail}
              className="w-full mt-4"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SeekerProfile;
