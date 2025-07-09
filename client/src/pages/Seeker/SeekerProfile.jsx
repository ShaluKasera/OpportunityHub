import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

import JobTabsSection from "./JobTabsSection";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import FileUpload from "../../components/FileUpload";

const SeekerProfile = () => {
  const [user, setUser] = useState({ profilePic: "", name: "", email: "" });
  const [jobSeeker, setJobSeeker] = useState({
    domain: "",
    location: "",
    experienceYears: "",
    phone: "",
    skills: [],
    resumeUrl: "",
    availabilityStatus: "",
  });

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isProfessionalEditOpen, setIsProfessionalEditOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(true);
  const [jobOffersLoading, setJobOffersLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profil, setProfile] = useState(null);
  const pathname = window.location.pathname;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/seeker/profile");
        const data = res.data;
        const userData = data.user || {};
        setUser({
          name: userData.name,
          email: userData.email,
          profilePic:
            data.profilePicUrl ||
            "https://randomuser.me/api/portraits/lego/2.jpg",
        });
        setJobSeeker({
          domain: data.domain,
          location: data.location,
          experienceYears: data.experienceYears,
          phone: data.phone,
          skills: Array.isArray(data.skills) ? data.skills : [],
          resumeUrl: data.resumeUrl,
          availabilityStatus: data.availabilityStatus,
        });
      } catch (error) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await axios.put("/seeker/profile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) window.location.reload();
      toast.success("Profile updated successfully!", {
        id: `success-${pathname}`,
      });
    } catch (error) {
      console.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setJobSeeker((prev) => ({ ...prev, [name]: value }));
  };
  const handleFile = (file) => {
    setProfile(file);
  };
  const handleSaveProfile = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", jobSeeker.phone);
    formData.append("domain", jobSeeker.domain);
    formData.append("experienceYears", jobSeeker.experienceYears);
    formData.append("location", jobSeeker.location);
    formData.append("resumeUrl", jobSeeker.resumeUrl);
    formData.append("availabilityStatus", jobSeeker.availabilityStatus);
    jobSeeker.skills.forEach((skill, index) =>
      formData.append(`skills[${index}]`, skill)
    );

    if (profil) {
      formData.append("profilePic", profil);
    }

    const res = await axios.put("/seeker/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 200) {
      toast.success("Profile updated successfully!");
      window.location.reload();
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile.");
  } finally {
    setLoading(false);
    setIsProfileEditOpen(false);
  }
};


  const handleSaveProfessionalDetail = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: user.name,
      phone: jobSeeker.phone,
      domain: jobSeeker.domain,
      experienceYears: jobSeeker.experienceYears,
      skills: jobSeeker.skills,
      location: jobSeeker.location,
      resumeUrl: jobSeeker.resumeUrl,
      availabilityStatus: jobSeeker.availabilityStatus,
    });

    setIsProfessionalEditOpen(false);
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get("/seeker/all-applied-job");
        if (res.data.success) {
          const formattedJobs = res.data.applications.map((app) => ({
            id: app.job.id,
            title: app.job.title,
            company: app.job.domain || "Unknown Company",
          }));
          setAppliedJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching applied jobs");
      } finally {
        setAppliedJobsLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    const fetchOfferedJobs = async () => {
      try {
        const res = await axios.get("/seeker/job-offers");
        if (res.data.success) {
          const formattedJobs = res.data.jobOffers.map((app) => ({
            jobId: app.job.id,
            jobOfferId: app.id,
            title: app.job.title,
            company: app.job.domain || "Unknown Company",
          }));
          setJobOffers(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching offered jobs:", error);
      } finally {
        setJobOffersLoading(false);
      }
    };
    fetchOfferedJobs();
  }, []);

  const handleViewDetails = (job) => console.log("Job details clicked:", job);

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto space-y-10">
      {/* Profile Section */}
      <section className="relative bg-white p-6 rounded-xl border shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:text-2xl font-bold">Professional Details</p>
          <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsProfileEditOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-y-4 sm:gap-x-10 px-2">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
          />
          <div className="text-center sm:!text-left">
            <h2 className="text-xl font-extrabold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{jobSeeker.location}</p>
          </div>
        </div>
      </section>

      {/* Professional Details Section */}
      <section className="relative bg-white p-4 sm:p-6 rounded-xl border shadow space-y-4 text-sm sm:text-base">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:text-2xl font-bold">Professional Details</p>
          <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsProfessionalEditOpen(true)}
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700">
          <div>
            <b>Domain:</b> {jobSeeker.domain || "N/A"}
          </div>
          <div>
            <b>Location:</b> {jobSeeker.location || "N/A"}
          </div>
          <div>
            <b>Experience:</b> {jobSeeker.experienceYears ?? "N/A"} years
          </div>
          <div>
            <b>Phone:</b> {jobSeeker.phone || "N/A"}
          </div>
          <div className="sm:col-span-2">
            <b>Skills:</b> {jobSeeker.skills?.join(", ") || "N/A"}
          </div>
          <div className="sm:col-span-2 break-words">
            <b>Resume:</b>{" "}
            {jobSeeker.resumeUrl ? (
              <a
                href={jobSeeker.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline"
              >
                View Resume
              </a>
            ) : (
              "N/A"
            )}
          </div>
          <div className="sm:col-span-2">
            <b>Availability Status:</b>{" "}
            <span
              className={`font-semibold ${
                jobSeeker.availabilityStatus === "available"
                  ? "text-green-600"
                  : jobSeeker.availabilityStatus === "employed"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {jobSeeker.availabilityStatus?.replace("_", " ")?.toUpperCase() ||
                "N/A"}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="border rounded-xl mt-8">
        <JobTabsSection
          appliedJobs={appliedJobs}
          jobOffers={jobOffers}
          handleViewDetails={handleViewDetails}
          appliedJobsLoading={appliedJobsLoading}
          jobOffersLoading={jobOffersLoading}
        />
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
            <p className="text-xl font-bold mb-4">Edit Profile</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full input"
            />
            <input
              type="text"
              name="location"
              value={jobSeeker.location}
              onChange={handleProfessionalChange}
              placeholder="Location"
              className="w-full input mb-2"
            />
            <FileUpload className="!mt-2" label="Upload Company Logo" onChange={handleFile} />
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button onClick={handleSaveProfile} className="red-button">
                Save
              </button>
            )}
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
            <p className="text-xl font-bold mb-4">Edit Professional Details</p>
            <input
              type="text"
              name="phone"
              value={jobSeeker.phone}
              onChange={handleProfessionalChange}
              placeholder="Phone"
              className="w-full input"
            />
            <input
              type="text"
              name="domain"
              value={jobSeeker.domain}
              onChange={handleProfessionalChange}
              placeholder="Domain"
              className="w-full input"
            />
            <input
              type="text"
              name="experienceYears"
              value={jobSeeker.experienceYears}
              onChange={handleProfessionalChange}
              placeholder="Experience (Years)"
              className="w-full input"
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
              className="w-full input"
            />
            <input
              type="text"
              name="resumeUrl"
              value={jobSeeker.resumeUrl}
              onChange={handleProfessionalChange}
              placeholder="Resume URL"
              className="w-full input"
            />
            <select
              name="availabilityStatus"
              value={jobSeeker.availabilityStatus}
              onChange={handleProfessionalChange}
              className="w-full input"
            >
              <option value="">Select Availability</option>
              <option value="available">Available</option>
              <option value="employed">Employed</option>
              <option value="unavailable">Unavailable</option>
            </select>
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                variant="outline-danger"
                onClick={handleSaveProfessionalDetail}
                className="red-button"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerProfile;
