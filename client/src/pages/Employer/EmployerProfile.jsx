import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import FileUpload from "../../components/FileUpload";
import Loading from "../../components/Loading";

const EmployerProfile = () => {
  const [user, setUser] = useState({
    companyLogo: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [employer, setEmployer] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    phone: "",
    isVerified: false,
  });

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/employer/profile");
        const data = res.data.profile;
        const userData = data.user || {};

        setUser((prev) => ({
          ...prev,
          name: userData.name,
          email: userData.email,
          location: data.location,
          companyLogo:
            data.companyLogoUrl ||
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
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await axios.put("/employer/profile", profileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        window.location.reload();
        const pathname = window.location.pathname;
        toast.success("Profile updated successfully!", {
          id: `success-${pathname}`,
        });
      }
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
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
  const handleFile = (file) => {
    setLogoFile(file);
  };

  // SAVE PROFILE BUTTON
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", employer.phone);
    formData.append("companyName", employer.companyName);
    formData.append("companySize", employer.companySize);
    formData.append("industry", employer.industry);
    formData.append("location", employer.location);
    formData.append("description", employer.description);

    if (logoFile) {
      formData.append("companyLogoUrl", logoFile);
    }

    await updateProfile(formData);
    setIsProfileEditOpen(false);
  };

  // SAVE COMPANY BUTTON
  const handleSaveCompany = async(e) => {
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

    await updateProfile(profileData);
    setIsCompanyEditOpen(false);
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto space-y-10">
      {/* Profile Section */}
      <section className="relative bg-white p-4 sm:p-6 border rounded-xl shadow">
        <p className="text-2xl sm:text-3xl font-bold mb-4 Ysabeau_Infant">
          Profile
        </p>
        <button
          className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
          onClick={() => setIsProfileEditOpen(true)}
        >
          Edit
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-10 px-2 sm:px-6">
          <img
            src={user.companyLogo}
            alt={`${user.name} profile`}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
          />
          <div className="text-center sm:!text-left w-full sm:w-auto">
            <p className="text-xl sm:text-2xl font-extrabold Ysabeau_Infant mb-1">
              {user.name}
            </p>
            <p className="text-gray-600 mb-1 break-all max-w-full">
              {user.email}
            </p>
            <p className="text-gray-600">{user.location}</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="relative bg-white p-4 sm:p-6 border rounded-xl shadow">
        <p className="text-2xl sm:text-3xl font-bold mb-4 Ysabeau_Infant">
          Company Details
        </p>

        <button
          className="absolute top-4 right-4 text-red-700 border-2 px-3 py-1 !rounded-2xl hover:text-white hover:bg-red-700 border-red-700 font-medium duration-300"
          onClick={() => setIsCompanyEditOpen(true)}
        >
          Edit
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm break-words w-full">
          <div>
            <span className="font-semibold">Company Name:</span>{" "}
            <span className="break-words">{employer.companyName}</span>
          </div>
          <div>
            <span className="font-semibold">Company Size:</span>{" "}
            <span className="break-words">{employer.companySize}</span>
          </div>
          <div>
            <span className="font-semibold">Industry:</span>{" "}
            <span className="break-words">{employer.industry}</span>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            <span className="break-words">{employer.phone}</span>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">Location:</span>{" "}
            <span className="break-words">{employer.location}</span>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <span className="font-semibold">Description:</span>{" "}
            <span className="break-words">{employer.description}</span>
          </div>
          <div className="col-span-1 sm:col-span-2">
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

      {/* Profile Edit Modal */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md space-y-4 relative overflow-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsProfileEditOpen(false)}
              aria-label="Close Profile Edit"
            >
              ×
            </button>
            <p className="text-2xl sm:text-3xl font-bold Ysabeau_Infant">
              Edit Profile
            </p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full input"
            />
            <FileUpload label="Upload Company Logo" onChange={handleFile} />
            {loading ? (
              <Loading width="100%"/>
            ) : (
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="red-button"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* Company Edit Modal */}
      {isCompanyEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md space-y-4 relative overflow-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsCompanyEditOpen(false)}
              aria-label="Close Company Edit"
            >
              ×
            </button>
            <p className="text-2xl sm:text-3xl font-bold Ysabeau_Infant">
              Edit Company Details
            </p>
            <input
              type="text"
              name="companyName"
              value={employer.companyName}
              onChange={handleCompanyChange}
              placeholder="Company Name"
              className="w-full input"
            />
            <input
              type="text"
              name="industry"
              value={employer.industry}
              onChange={handleCompanyChange}
              placeholder="Industry"
              className="w-full input"
            />
            <input
              type="text"
              name="companySize"
              value={employer.companySize}
              onChange={handleCompanyChange}
              placeholder="Company Size (e.g., 11-50)"
              className="w-full input"
            />
            <input
              type="text"
              name="location"
              value={employer.location}
              onChange={handleCompanyChange}
              placeholder="Location"
              className="w-full input"
            />
            <input
              type="text"
              name="phone"
              value={employer.phone}
              onChange={handleCompanyChange}
              placeholder="Phone"
              className="w-full input"
            />
            <textarea
              name="description"
              value={employer.description}
              onChange={handleCompanyChange}
              placeholder="Company Description"
              className="w-full input"
              rows={4}
            />
            {loading ? (
              <Loading width="100%"/>
            ) : (
              <button
                onClick={handleSaveCompany}
                disabled={loading}
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

export default EmployerProfile;
