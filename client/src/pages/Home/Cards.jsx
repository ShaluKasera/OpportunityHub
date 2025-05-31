import { Link } from "react-router-dom";

const Cards = ({ job }) => {
  return (
    <div className="relative bg-white rounded-xl shadow p-4 hover:shadow-lg transition max-w-md mx-auto">
      <div className="absolute top-1 right-3  text-gray-500 text-xs px-3  rounded-full">
        {job.daysLeft} days left
      </div>

      <div className="flex items-center space-x-3 mb-2">
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          className="w-10 h-10 object-contain rounded"
        />

        <div className="flex flex-wrap items-center space-x-2 text-gray-700 text-sm font-medium">
          <span>{job.company}</span>
          <span className="text-gray-400">•</span>
          <span>{job.location}</span>
        </div>
      </div>

      <p className="text-3xl font-extrabold mb-2 Ysabeau_Infant">{job.title}</p>

      {/* Job description */}
      <p className="text-gray-600 mb-4 text-sm">{job.description}</p>

      {/* Openings, Job type, Salary */}
      <div className="flex space-x-2  text-xs font-semibold mb-4">
        <span className=" rounded-2xl bg-red-400 py-1 px-2 text-white">
          {job.openings} openings
        </span>
        <span className=" rounded-2xl bg-gray-200 py-1 px-2 ">{job.type}</span>
        <span className=" rounded-2xl bg-gray-200 py-1 px-2 ">
          {job.salary}
        </span>
      </div>

      {/* View Details button */}
      <Link
        to="/details"
        className="block w-full text-center !no-underline  bg-white border-2 border-red-700 !text-red-700 py-2 rounded hover:!bg-red-700 hover:!text-white transition font-semibold  "  
      >
        View Details
      </Link>
    </div>
  );
};

export default Cards;
