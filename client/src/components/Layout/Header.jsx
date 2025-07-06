import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

import axios from "../../api/axios";
import Login from "../../pages/Auth/Login";

const Header = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const token = localStorage.getItem("token");

    // ✅ Try localStorage first
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      return; // Skip fetch if already stored
    }

    if (consent !== "accepted" || !token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/me", { withCredentials: true });
        setUser(res.data);
        setRole(res.data.role);

        // Optional: store again in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("role", res.data.role);
      } catch (err) {
        setUser(null);
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  const handleMyAccount = () => {
    if (role === "employer") {
      navigate("/profile");
    } else if (role === "job_seeker") {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/user/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    } catch (err) {
      // Error is globally handled
      toast.error("Logout failed");
    }
  };

  const ProfileMenu = () => (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        className="d-flex align-items-center gap-2 bg-transparent border-0"
        id="dropdown-basic"
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="User"
            className="rounded-circle"
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
          />
        ) : (
          <FaUserCircle size={30} className="text-black" />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            setExpanded(false);
            handleMyAccount();
          }}
        >
          My Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={logout}
          className="d-flex justify-content-between"
        >
          Logout
          <IoLogOutOutline size={20} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      <Toaster reverseOrder={false} />
      <Navbar
        bg="light"
        expand="lg"
        className="py-3 px-3 px-md-5 shadow-sm"
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand as={Link} className="!text-3xl fw-bold">
            Job<span className="text-danger">Hunt</span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              {role === "job_seeker" && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/job"
                    onClick={() => setExpanded(false)}
                  >
                    Jobs
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {role === "employer" && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/employer-dashboard"
                    onClick={() => setExpanded(false)}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/post-job"
                    onClick={() => setExpanded(false)}
                  >
                    Post Job
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/manage-applications"
                    onClick={() => setExpanded(false)}
                  >
                    Manage Applications
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {!user && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/job"
                    onClick={() => setExpanded(false)}
                  >
                    Jobs
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      setShowLogin(true);
                      setExpanded(false);
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/signup"
                    onClick={() => setExpanded(false)}
                  >
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Login
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setRole(loggedInUser.role);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          localStorage.setItem("role", loggedInUser.role);
        }}
      />
    </>
  );
};

export default Header;
