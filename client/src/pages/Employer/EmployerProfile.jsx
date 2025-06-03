import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const EmployerProfile = () => {
  const [user, setUser] = useState({
    profilePic: "",
    name: "",
    email: "",
  });

  const [employer, setEmployer] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    phone: "",
    isVerified: false,
  });

  const [decoded, setDecoded] = useState(null);

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("posted");

  const postedJobs = [
    { id: 1, title: "Software Engineer", applicants: 12 },
    { id: 2, title: "UI/UX Designer", applicants: 5 },
  ];

  const jobApplications = [
    { id: 1, applicant: "John Doe", position: "Software Engineer" },
    { id: 2, applicant: "Alice Johnson", position: "UI/UX Designer" },
  ];

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
            "http://localhost:8000/api/employer/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = res.data;

          const userData = data.user || {};

          console.log(userData);

          setUser((prev) => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            location: data.location,
            profilePic:
              userData.profilePic ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          }));

          setEmployer({
            companyName: data.companyName,
            companySize: data.companySize,
            industry: data.industry,
            location: data.location || userData.location,
            description: data.description,
            phone: data.phone,
            isVerified: data.isVerified,
          });

          console.log("Fetched name:", userData.name);
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
        "http://localhost:8000/api/employer/profile",
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

  // HANDLERS FOR COMPANY INPUTS
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE PROFILE BUTTON
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const profileData = {
      name: user.name,
      phone: employer.phone,
      companyName: employer.companyName,
      companySize: employer.companySize,
      industry: employer.industry,
      location: employer.location,
      description: employer.description,
    };

    updateProfile(profileData);
    setIsProfileEditOpen(false);
  };

  // SAVE COMPANY BUTTON
  const handleSaveCompany = (e) => {
    e.preventDefault();

    const profileData = {
      name: user.name,
      phone: employer.phone,
      companyName: employer.companyName,
      companySize: employer.companySize,
      industry: employer.industry,
      location: employer.location,
      description: employer.description,
    };

    updateProfile(profileData);
    setIsCompanyEditOpen(false);
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto space-y-10">
      {/* Profile Section */}
      <section className="relative bg-white p-6 border rounded-xl shadow">
        <p className="text-3xl font-bold mb-4 Ysabeau_Infant">Profile</p>
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
            <p className="text-2xl font-extrabold Ysabeau_Infant mb-1">{user.name}</p>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-600">{user.location}</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="relative bg-white p-6 border rounded-xl shadow space-y-2">
        <p className="text-3xl font-bold mb-4 Ysabeau_Infant">
          Company Details
        </p>
        <button
          className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
          onClick={() => setIsCompanyEditOpen(true)}
        >
          Edit
        </button>
        <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
          <div>
            <span className="font-semibold">Company Name:</span>{" "}
            {employer.companyName}
          </div>
          <div>
            <span className="font-semibold">Company Size:</span>{" "}
            {employer.companySize}
          </div>
          <div>
            <span className="font-semibold">Industry:</span> {employer.industry}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {employer.phone}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Location:</span> {employer.location}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Description:</span>{" "}
            {employer.description}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Verified:</span>{" "}
            <span
              className={`font-semibold ${
                employer.isVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {employer.isVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white p-6 rounded-xl border shadow">
        <div className="flex space-x-4 border-b gap-4 border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("posted")}
            className={`pb-2 font-semibold text-sm ${
              activeTab === "posted"
                ? "border-b-2 border-red-700 text-red-700"
                : "text-gray-500"
            }`}
          >
            Posted Jobs
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-2 font-semibold text-sm ${
              activeTab === "applications"
                ? "border-b-2 border-red-700 text-red-700"
                : "text-gray-500"
            }`}
          >
            Applications
          </button>
        </div>

        <ul className="space-y-4">
          {(activeTab === "posted" ? postedJobs : jobApplications).map(
            (job) => (
              <li
                key={job.id}
                className="p-4 border border-gray-200 rounded hover:shadow cursor-pointer"
              >
                {activeTab === "posted" ? (
                  <>
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-gray-600">{job.applicants} applicants</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{job.applicant}</h4>
                    <p className="text-gray-600">Applied for {job.position}</p>
                  </>
                )}
              </li>
            )
          )}
          {(activeTab === "posted" && postedJobs.length === 0) ||
          (activeTab === "applications" && jobApplications.length === 0) ? (
            <p>No data found.</p>
          ) : null}
        </ul>
      </section>
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
            <p className="text-3xl font-bold Ysabeau_Infant">Edit Profile</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange} // added handler here
              placeholder="Name"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleProfileChange} // you might want to disable editing email here if backend doesn't allow update
              placeholder="Email"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
              disabled
            />

            <Button
              variant="outline-danger"
              onClick={handleSaveProfile} // added save handler
              className="w-full font-bold"
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Company Edit Modal */}
      {isCompanyEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsCompanyEditOpen(false)}
            >
              ×
            </button>
            <p className="text-3xl font-bold Ysabeau_Infant">
              Edit Company Details
            </p>
            <input
              type="text"
              name="companyName"
              value={employer.companyName}
              onChange={handleCompanyChange} // added handler here
              placeholder="Company Name"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="industry"
              value={employer.industry}
              onChange={handleCompanyChange}
              placeholder="Industry"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="companySize"
              value={employer.companySize}
              onChange={handleCompanyChange}
              placeholder="Company Size (e.g., 11-50)"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="location"
              value={employer.location}
              onChange={handleCompanyChange}
              placeholder="Location"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <input
              type="text"
              name="phone"
              value={employer.phone}
              onChange={handleCompanyChange}
              placeholder="Phone"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <textarea
              name="description"
              value={employer.description}
              onChange={handleCompanyChange}
              placeholder="Company Description"
              className="w-full border p-2 mb-2 rounded focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <Button
              variant="outline-danger"
              onClick={handleSaveCompany} 
              className="w-full font-bold"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
