import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (isoDate) => {
  if (!isoDate) return "Not available";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const OfferedJobDetails = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/seeker/job-offers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setJobData(res.data.jobOffer);
      }
    } catch (error) {
      toast.error("Error fetching job offer details");
      console.error("Error fetching job offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (action) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8000/api/seeker/job-offers/${id}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Offer ${action === "accepted" ? "accepted" : "rejected"} successfully`
      );
      fetchJobDetails();
    } catch (error) {
      console.error(`Failed to ${action} job offer:`, error);
      toast.error(`Failed to ${action} offer. Please try again.`);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-6 text-center text-white text-xl font-semibold">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!jobData) {
    return (
      <Layout>
        <div className="container py-6 text-center text-red-700 font-bold">
          Job offer not found.
        </div>
      </Layout>
    );
  }

  const { job, employer, status, sentAt, respondedAt } = jobData;

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Job Info */}
        <section>
          <p className="text-2xl sm:text-3xl font-bold mb-4 border-b border-red-700 Ysabeau_Infant pb-2">
            {job.title}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800">
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Domain:</strong> {job.domain}</p>
            <p><strong>Experience:</strong> {job.experienceRequired || "Not specified"}</p>
            <p><strong>Deadline:</strong> {formatDate(job.deadline)}</p>
            <p><strong>Openings:</strong> {job.openings}</p>
            <p><strong>Skills:</strong> {job.skills?.join(", ") || "Not specified"}</p>
          </div>
          <p className="mt-4"><strong>Description:</strong> {job.description}</p>
        </section>

        {/* Employer Info */}
        <section className="border-t border-red-700 pt-6">
          <p className="text-2xl sm:text-3xl font-semibold Ysabeau_Infant mb-4">About Employer</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800">
            <p><strong>Company Name:</strong> {employer.companyName}</p>
            <p><strong>Location:</strong> {employer.location}</p>
            <p><strong>Industry:</strong> {employer.industry}</p>
            <p><strong>Company Size:</strong> {employer.companySize}</p>
            <p><strong>Phone:</strong> {employer.phone}</p>
            <p ><strong>Email:</strong> {employer.user.email}</p>
            <p><strong>Contact Person:</strong> {employer.user.name}</p>
          </div>
          <p className="mt-4"><strong>About Company:</strong> {employer.description}</p>
        </section>

        {/* Offer Info */}
        <section className="border-t border-b border-red-700 py-6">
          <p className="text-2xl sm:text-3xl font-semibold Ysabeau_Infant mb-4">Offer Details</p>
          <div className="space-y-2 text-gray-800">
            <p><strong>Status:</strong> <span className="text-blue-500">{status}</span></p>
            <p><strong>Sent At:</strong> {formatDate(sentAt)}</p>
            <p><strong>Responded At:</strong> {respondedAt ? formatDate(respondedAt) : "Not yet responded"}</p>
          </div>
        </section>

        {/* Action Buttons */}
        {status === "sent" && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
            <Button
              variant="outline-success"
              className="w-full sm:w-auto"
              onClick={() => handleResponse("accepted")}
            >
              Accept Offer
            </Button>
            <Button
              variant="outline-danger"
              className="w-full sm:w-auto"
              onClick={() => handleResponse("rejected")}
            >
              Reject Offer
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OfferedJobDetails;
