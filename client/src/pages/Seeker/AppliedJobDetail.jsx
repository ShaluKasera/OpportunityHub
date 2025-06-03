import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AppliedJobDetail = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/seeker/applied-jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setJobData(res.data.application);
        }
      } catch (error) {
        console.error("Error fetching applied job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-6 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!jobData) {
    return (
      <Layout>
        <div className="container py-6 text-center text-red-600">Job not found.</div>
      </Layout>
    );
  }

  const { job, status, coverLetter, createdAt } = jobData;

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="Ysabeau_Infant text-4xl font-extrabold">{job.title}</p>
            <div className="flex space-x-4 text-xs font-semibold mt-1">
              <span className="text-md text-red-700">Location: {job.location}</span>
              <span className="text-md text-gray-500">{job.jobType}</span>
              <span className="text-md text-green-700">{job.salary}</span>
            </div>
          </div>
          <div className="text-sm font-medium">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
              Status: {status}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">Applied on: <strong>{formatDate(createdAt)}</strong></p>

        {job.deadline && (
          <p className="text-sm text-gray-500 mb-4">Deadline: <strong>{formatDate(job.deadline)}</strong></p>
        )}

        <p className="font-semibold mb-1">Job Description</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">{job.description}</p>

        <p className="font-semibold">Domain</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">{job.domain}</p>

        <p className="font-semibold">Experience Required</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">
          {job.experienceRequired || "Not specified"}
        </p>

        {coverLetter && (
          <>
            <p className="font-semibold">Your Cover Letter</p>
            <hr className="mb-2" />
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{coverLetter}</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AppliedJobDetail;
