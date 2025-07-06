import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const consent = localStorage.getItem("cookieConsent");

    if (token && userData && consent === "accepted") {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await axios.get("/user/me");
      setRole(res.data.role);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user role");
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