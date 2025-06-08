import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const formatDate = (isoDate) => {
  if (!isoDate) return "Not available";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

const PostedJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/employer/posted-joblist/${jobId}`,
        { withCredentials: true }
      );
      setJob(res.data.job);
      setFormData(res.data.job);
    } catch (err) {
      console.error("Failed to fetch job detail:", err);
      showToast("error", "Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((skill) => skill.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleJobUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/employer/update-job/${jobId}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Job updated successfully!");
      setTimeout(() => {
        setEditMode(false);

        fetchJobDetail();
      }, 3000);
    } catch (err) {
      console.error("Failed to update job:", err);
      toast.error("Failed to update job. Please try again");
    } finally {
      setUpdating(false);
    }
  };
  const handleSendOffers = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/employer/send-jobOffer`,
        { jobId: Number(jobId) },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Offers sent successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Unknown error";
      if (message === "Job openings already filled.") {
        toast.info("You cannot send more offers. All openings are filled.");
      } else {
        console.error("Failed to send offers:", err);
        toast.error("Error sending offers: " + message);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-6 text-center text-white text-xl font-semibold">
          Loading job details...
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container py-6 text-center text-red-700 font-bold">
          Job not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container max-w-4xl mx-auto py-10 px-6 space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold border-b border-red-700 pb-2">
            {job.title}
          </h2>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="hover:bg-red-700 hover:text-white text-red-700 px-4 py-2 rounded border-2 border-red-700 transition-all duration-300"
            >
              Edit Job
            </button>
          )}
        </div>

        {!editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Job Type:</strong> {job.jobType}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Domain:</strong> {job.domain}
              </p>
              <p>
                <strong>Experience Required:</strong> {job.experienceRequired}
              </p>
              <p>
                <strong>Deadline:</strong> {formatDate(job.deadline)}
              </p>
              <p>
                <strong>Openings:</strong> {job.openings}
              </p>
              <p>
                <strong>Skills:</strong> {job.skills?.join(", ")}
              </p>
            </div>
            <p className="mt-4">
              <strong>Description:</strong> {job.description}
            </p>
            <button
              onClick={handleSendOffers}
              className="mt-6 text-red  hover:bg-red-700 border-2 border-red-700 hover:text-white px-4 py-2 rounded transition-all duration-300 "
            >
              Send Offer to Relevant Seekers
            </button>
          </>
        ) : (
          <form onSubmit={handleJobUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Job Title"
                required
                className="border rounded p-2"
              />
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                placeholder="Location"
                required
                className="border rounded p-2"
              />
              <input
                type="text"
                name="domain"
                value={formData.domain || ""}
                onChange={handleInputChange}
                placeholder="Domain"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="experienceRequired"
                value={formData.experienceRequired || ""}
                onChange={handleInputChange}
                placeholder="Experience Required"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="jobType"
                value={formData.jobType || ""}
                onChange={handleInputChange}
                placeholder="Job Type"
                className="border rounded p-2"
              />
              <input
                type="number"
                name="openings"
                value={formData.openings || ""}
                onChange={handleInputChange}
                placeholder="Openings"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="salary"
                value={formData.salary || ""}
                onChange={handleInputChange}
                placeholder="Salary"
                className="border rounded p-2"
              />
              <input
                type="date"
                name="deadline"
                value={formatDate(formData.deadline)}
                onChange={handleInputChange}
                placeholder="Deadline"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="skills"
                value={formData.skills?.join(", ") || ""}
                onChange={handleInputChange}
                placeholder="Skills (comma-separated)"
                className="border rounded p-2"
              />
            </div>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Description"
              className="border rounded p-2 w-full"
              rows="5"
            />
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="hover:bg-green-700 hover:text-white text-green-700 border-2 border-green-700 transition-all duration-300 px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(job);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-300"
        >
          <span className="font-bold  me-2">←</span> Back
        </button>
      </div>
    </Layout>
  );
};

export default PostedJobDetail;
