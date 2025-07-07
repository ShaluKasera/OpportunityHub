import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/Loading";

const Detail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = window.location.pathname;
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (storedUser && storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/user/job/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const res = await axios.post(`/seeker/apply-job`, {
        jobId: id,
        coverLetter:
          "I'm interested in this job and believe I can contribute effectively.",
      });

      toast.success(res.data.message || "Applied successfully", {
        id: `err-error-${pathname}`,
      });
    } catch (err) {
      console.error("Apply job error:", err);
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return <p className="p-6 text-gray-600">Loading job details...</p>;
  if (!job) return <p className="p-6 text-red-600">Job not found.</p>;

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="Ysabeau_Infant text-4xl font-extrabold">
              {job.title}
            </p>
            <div className="flex space-x-4 text-xs font-semibold">
              <span className="text-md text-red-700">
                {job.openings} openings
              </span>
              <span className="text-md text-gray-500">{job.jobType}</span>
              <span className="text-md text-green-700">{job.salary}</span>
            </div>
          </div>

          {isLoggedIn &&
            userRole === "job_seeker" &&
            (applying ? (
              <Loading color="danger" />
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="px-6 py-2 bg-red-700 hover:bg-white text-white rounded-3xl border-2 hover:text-red-700 border-red-700 hover:border-red-700 duration-300"
              >
                Apply Now
              </button>
            ))}
        </div>

        {/* Job Details */}
        <p className="font-semibold mb-1">Job Description</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">{job.description}</p>

        <p className="font-semibold">Domain</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">{job.domain}</p>

        <p className="font-semibold">Experience Required</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700 mb-4">{job.experienceRequired}</p>

        <p className="font-semibold">Skills Required</p>
        <hr className="mb-2" />
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
          {job.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>

        <p className="font-semibold">Application Deadline</p>
        <hr className="mb-2" />
        <p className="text-sm text-gray-700">{formatDate(job.deadline)}</p>
      </div>
    </Layout>
  );
};

export default Detail;
