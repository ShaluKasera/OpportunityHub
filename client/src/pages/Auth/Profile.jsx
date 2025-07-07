import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import SeekerProfile from "../Seeker/SeekerProfile";
import EmployerProfile from "../Employer/EmployerProfile";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Layout>
      {role === "" ? (
        <div>Loading profile...</div>
      ) : role === "employer" ? (
        <EmployerProfile />
      ) : (
        <SeekerProfile />
      )}
    </Layout>
  );
};

export default Profile;
