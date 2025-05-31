import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import SeekerProfile from "./SeekerProfile";
import EmployerProfile from "./EmployerProfile";
import {jwtDecode} from "jwt-decode";

const Profile = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
      
        setRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <Layout>
      {role === "employer" ? <EmployerProfile /> : <SeekerProfile />}
    </Layout>
  );
};

export default Profile;
