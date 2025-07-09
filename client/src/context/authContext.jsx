import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (consent === "accepted") {
      fetchUserData(); 
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("/user/me");
      setUser(res.data.user);
      setRole(res.data.role);
    } catch (err) {
      const pathname = window.location.pathname;
      toast.error(err.response?.data?.message || "Failed to fetch user role",{ id: `err-error-${pathname}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
