import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const ApplicationsDetail = () => {
  const { state: application } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(application?.status || "");
  const [loading, setLoading] = useState(false);

  if (!application) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <p>No application data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const { jobSeeker, coverLetter, createdAt, id: applicationId } = application;
  const { user, domain, location, phone, skills, resumeUrl } = jobSeeker || {};

  const handleStatusSelectChange = (e) => {
    setStatus(e.target.value);
  };

  const saveStatusChange = async () => {
    try {
      setLoading(true);
      await axios.put(`/employer/update-application-status/${applicationId}`, {
        status,
      });
      const pathname = window.location.pathname;
      toast.success(`Application status updated to "${status}"`, {
        id: `err-error-${pathname}`,
      });
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10 max-w-4xl">
        {/* Applicant Info */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 border-b border-red-700 pb-2">
            Applicant Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm sm:text-base">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Domain:</strong> {domain}
            </p>
            <p>
              <strong>Location:</strong> {location}
            </p>
            <p>
              <strong>Skills:</strong> {skills?.join(", ")}
            </p>
          </div>
        </section>

        {/* Application Info */}
        <section className="border-t border-red-700 pt-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Application Details
          </h2>
          <div className="space-y-3 text-gray-800 text-sm sm:text-base">
            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Cover Letter:</strong> {coverLetter}
            </p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                View Resume
              </a>
            </p>
          </div>
        </section>

        {/* Application Status */}
        <section className="border-t border-b border-red-700 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Manage Application Status
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label htmlFor="status" className="font-semibold">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={handleStatusSelectChange}
              className="border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
            >
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="mt-4">
            
              <button
                onClick={saveStatusChange}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full sm:w-auto"
              >{loading ? (
              <Loading color="success" />
            ) : (
                "Save Status" )}
              </button>
           
          </div>
        </section>

        {/* Back Button */}
        <div className="pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded w-full sm:w-auto"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationsDetail;
