import React from "react";
import Cards from "./Cards"
import { FaRegUserCircle } from "react-icons/fa";

const Hero1 = () => {
 
    const latestJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Corp",
    location: "Remote",
    daysLeft: 5,
    logo: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
    description: "Build amazing user interfaces with React.js and Tailwind CSS.",
    openings: 3,
    type: "Full-time",
    salary: "$70k - $90k",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Code Labs",
    location: "New York",
    daysLeft: 12,
    logo: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
    description: "Develop scalable APIs and backend services using Node.js and Express.",
    openings: 2,
    type: "Full-time",
    salary: "$80k - $100k",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Designify",
    location: "San Francisco",
    daysLeft: 8,
    logo: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
    description: "Design intuitive and user-friendly digital experiences.",
    openings: 1,
    type: "Contract",
    salary: "$50/hr",
  },
];


  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-black py-20 px-4 text-center">
        <p className="text-2xl md:text-4xl Yusei_Magic font-extrabold mb-4">
          Find Your Next <span className="text-red-700">Opportunity</span>
        </p>
        <p className="text-lg md:text-l mb-6 font-bold Ysabeau_Infant">
          Explore thousands of job listings and land your dream role today.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center max-w-xl mx-auto">
          <input
            type="text"
            className="rounded-l-full px-4 py-2 w-full border Ysabeau_Infant text-black focus:outline-none focus:ring-1 focus:ring-red-700"
            placeholder="Find your dream job..."
          />
          <button className="!rounded-r-full px-6 py-0.5 border-2 border-red-600 bg-red-700 text-white Ysabeau_Infant font-semibold hover:bg-white hover:!text-red-700 hover:border-2 hover:border-red-600 duration-300">
  Search
</button>

        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <p className="text-2xl md:text-4xl font-semibold Ysabeau_Infant mb-6">Latest & top <span className="text-red-700">Job Openings
          </span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <Cards key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero1;
