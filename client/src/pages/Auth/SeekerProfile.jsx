import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SeekerProfile = () => {
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

  const appliedJobs = [
    { id: 1, title: "Frontend Developer", company: "Tech Corp" },
    { id: 2, title: "Backend Engineer", company: "Code Labs" },
  ];

  const jobOffers = [
    { id: 1, title: "Full Stack Developer", company: "Dev Solutions" },
    { id: 2, title: "Backend Engineer", company: "Code Labs" },
  ];

  const [activeTab, setActiveTab] = useState("applied");

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

          

          setUser((prev) => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            profilePic:
              userData.profilePic ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          }));

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

  // SAVE PROFILE BUTTON
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

  return (
    <>
      <div className="container py-6 max-w-4xl mx-auto space-y-10">
        {/* Profile Section */}
        <section className="relative bg-white p-6 rounded-xl shadow">
          <p className="text-3xl font-bold mb-4 Ysabeau_Infant">Profile</p>
          <button
            className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
            onClick={() => setIsProfileEditOpen(true)}
          >
            Edit
          </button>
          <div className="flex items-center space-x-10 px-6">
            <img
              src={user.profilePic || undefined}
              alt={`${user.name} profile`}
              className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
            />
            <div>
              <h2 className="text-2xl font-extrabold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.location}</p>
            </div>
          </div>
        </section>

        {/* Professional Details Section */}
        <section className="relative bg-white p-6 rounded-xl shadow space-y-2">
          <p className="text-3xl font-bold mb-4 Ysabeau_Infant">
            Professional Details
          </p>
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
              <span className="font-semibold">Phone:</span> {jobSeeker.phone}
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
                {jobSeeker.availabilityStatus.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="flex space-x-4 border-b gap-4 border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab("applied")}
              className={`pb-2 font-semibold text-sm ${
                activeTab === "applied"
                  ? "border-b-2 border-red-700 text-red-700"
                  : "text-gray-500"
              }`}
            >
              Applied Jobs
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`pb-2 font-semibold text-sm ${
                activeTab === "offers"
                  ? "border-b-2 border-red-700 text-red-700"
                  : "text-gray-500"
              }`}
            >
              Job Offers
            </button>
          </div>

          <ul className="space-y-4">
            {(activeTab === "applied" && appliedJobs.length === 0) ||
            (activeTab === "offers" && jobOffers.length === 0) ? (
              <p className="text-gray-500">No jobs found.</p>
            ) : (
              (activeTab === "applied" ? appliedJobs : jobOffers).map((job) => (
                <li
                  key={job.id}
                  className="p-4 border border-gray-200 rounded hover:shadow cursor-pointer"
                >
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                </li>
              ))
            )}

            {(activeTab === "applied" && appliedJobs.length === 0) ||
            (activeTab === "offers" && jobOffers.length === 0) ? (
              <p>No jobs found.</p>
            ) : null}
          </ul>
        </section>
      </div>

      {/* Profile Edit Modal */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 !text-2xl font-bold"
              onClick={() => setIsProfileEditOpen(false)}
            >
              ×
            </button>
            <p className="text-3xl font-bold Ysabeau_Infant ">Edit Profile</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="location"
              value={jobSeeker.location}
              onChange={handleProfessionalChange}
              placeholder="Location"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />

            <Button
              variant="outline-danger"
              onClick={handleSaveProfile}
              className="w-full mt-2"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Professional Edit Modal */}
      {isProfessionalEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 !text-2xl font-bold"
              onClick={() => setIsProfessionalEditOpen(false)}
            >
              ×
            </button>
            <p className="text-3xl font-bold Ysabeau_Infant">
              Edit Professional Details
            </p>
            <input
              type="text"
              name="domain"
              value={jobSeeker.domain}
              onChange={handleProfessionalChange}
              placeholder="Domain"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="location"
              value={jobSeeker.location}
              onChange={handleProfessionalChange}
              placeholder="Location"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="number"
              name="experienceYears"
              value={jobSeeker.experienceYears}
              onChange={handleProfessionalChange}
              placeholder="Experience (years)"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="phone"
              value={jobSeeker.phone}
              onChange={handleProfessionalChange}
              placeholder="Phone"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="skills"
              value={jobSeeker.skills}
              onChange={handleProfessionalChange}
              placeholder="Phone"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="resumeUrl"
              value={jobSeeker.resumeUrl}
              onChange={handleProfessionalChange}
              placeholder="Resume URL"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <select
              name="availabilityStatus"
              value={jobSeeker.availabilityStatus}
              onChange={handleProfessionalChange}
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            >
              <option value="" default>
                Select Availability
              </option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="available">Available</option>
            </select>

            <Button
              variant="outline-danger"
              onClick={handleSaveProfessionalDetail}
              className="bg-red-700 text-red-700 px-4 py-2 !font-bold rounded w-full"
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
