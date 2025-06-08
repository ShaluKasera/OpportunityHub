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
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/seeker/applied-jobs/${jobId}`, {
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
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="Ysabeau_Infant text-2xl sm:text-4xl font-extrabold">{job.title}</p>
            <div className="flex flex-wrap gap-2 text-sm font-semibold mt-2">
              <span className="text-red-700">Location: {job.location}</span>
              <span className="text-gray-600">{job.jobType}</span>
              <span className="text-green-700">{job.salary}</span>
            </div>
          </div>
          <div className="text-sm font-medium">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300 inline-block">
              Status: {status}
            </span>
          </div>
        </div>

        {/* Applied Date */}
        <p className="text-sm text-gray-500 mb-2">
          Applied on: <strong>{formatDate(createdAt)}</strong>
        </p>

        {/* Deadline */}
        {job.deadline && (
          <p className="text-sm text-gray-500 mb-4">
            Deadline: <strong>{formatDate(job.deadline)}</strong>
          </p>
        )}

        {/* Job Description */}
        <section className="mb-6">
          <p className="font-semibold text-lg">Job Description</p>
          <hr className="my-2" />
          <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
        </section>

        {/* Domain */}
        <section className="mb-6">
          <p className="font-semibold text-lg">Domain</p>
          <hr className="my-2" />
          <p className="text-sm text-gray-700">{job.domain}</p>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <p className="font-semibold text-lg">Experience Required</p>
          <hr className="my-2" />
          <p className="text-sm text-gray-700">{job.experienceRequired || "Not specified"}</p>
        </section>

        {/* Cover Letter */}
        {coverLetter && (
          <section className="mb-6">
            <p className="font-semibold text-lg">Your Cover Letter</p>
            <hr className="my-2" />
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{coverLetter}</p>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default AppliedJobDetail;
