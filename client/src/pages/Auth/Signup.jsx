import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import EmployerSignup from "./EmployerSignup";
import SeekerSignup from "./SeekerSignup";

const Signup = () => {
  const [role, setRole] = useState("job_seeker");

  return (
    <Layout>
      <div className="mx-auto mb-10 mt-10 w-[80%] md:w-[60%] lg:w-[40%] border p-6 rounded shadow bg-white text-sm md:text-base">
        <div className="mb-6 text-center">
          <p className="text-4xl !font-extrabold mb-4 Ysabeau_Infant">Create an Account</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setRole("job_seeker")}
              className={`px-4 py-2 rounded  ${
                role === "job_seeker"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setRole("employer")}
              className={`px-4 py-2 rounded ${
                role === "employer"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Employer
            </button>
          </div>
        </div>

        {role === "job_seeker" ? <SeekerSignup /> : <EmployerSignup />}
      </div>
    </Layout>
  );
};

export default Signup;
