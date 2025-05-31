import React from "react";
import Layout from "../../components/Layout/Layout";

const Detail = () => {
  // Dummy data for now – replace with dynamic data as needed
  const job = {
    title: "Frontend Developer",
    openings: 2,
    jobType: "Full time",
    salary: "$200-$300",
    description:
      "We are looking for a skilled Frontend Developer to join our growing team. You will be responsible for building responsive and user-friendly interfaces using modern frameworks.",
    domain: "Web Development",
    experienceRequired: "1-3 years",
    skills: ["React", "JavaScript", "CSS", "HTML"],
    deadline: "2025-06-15T00:00:00Z",
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="Ysabeau_Infant text-4xl font-extrabold">
              {job.title}
            </p>
            <div className="flex space-x-4 text-xs font-semibold">
              <span className="text-md text-red-700">{job.openings} openings</span>
              <span className="text-md text-gray-500">{job.jobType}</span>
              <span className="text-md text-green-700">{job.salary}</span>
            </div>
          </div>

          <button className="px-6 py-2 bg-red-700 text-white !rounded-3xl hover:!text-red-700 border-2 border-red-700 hover:border-red-700 hover:bg-white duration-300">
            Apply Now
          </button>
        </div>

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
