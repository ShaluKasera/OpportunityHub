import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaLinkedin } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Modal,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:8000/api/user/login", {
        email,
        password,
      });

      const { token, user: userData, employer, jobSeeker } = res.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const loggedInUser = {
        ...userData,
        profileData: userData.role === "employer" ? employer : jobSeeker,
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setShowLogin(false);
      alert("Login successful!");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      alert(message);
    }
  };

  const logout = () => {
    alert("Logged out successfully.");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
  }, []);

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
        <Dropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
          My Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={logout} className="d-flex justify-content-between">
          Logout
          <IoLogOutOutline size={20} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="py-3 px-3 px-md-5 shadow-sm"
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="!text-3xl fw-bold">
            Job<span className="text-danger">Hunt</span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              {user?.role === "job_seeker" && (
                <>
                  <Nav.Link className="link" as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link className="link" as={Link} to="/job" onClick={() => setExpanded(false)}>
                    Jobs
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {user?.role === "employer" && (
                <>
                  <Nav.Link as={Link} className="link" to="/employer-dashboard" onClick={() => setExpanded(false)}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} className="link" to="/post-job" onClick={() => setExpanded(false)}>
                    Post Job
                  </Nav.Link>
                  <Nav.Link as={Link} className="link" to="/manage-applications" onClick={() => setExpanded(false)}>
                    Manage Applications
                  </Nav.Link>
                 
                  <ProfileMenu />
                </>
              )}

              {!user && (
                <>
                  <Nav.Link as={Link} className="link" to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} className="link" to="/job" onClick={() => setExpanded(false)}>
                    Jobs
                  </Nav.Link>
                  <Nav.Link className="link" onClick={() => { setShowLogin(true);  setExpanded(false); }}>
                    Login
                  </Nav.Link>
                  <Nav.Link className="link" as={Link} to="/signup" onClick={() => setExpanded(false)}>
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        centered
        dialogClassName="modal-90w"
        contentClassName="p-3 rounded-xl"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <div className="w-100">
            <p className="fs-3 text-center fw-bold text-gray-800">Login</p>
            <p className="text-muted small text-center">
              Don’t have an account? <Link to="/signup">Register now</Link>
            </p>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleLoginSubmit} className="space-y-4">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="text-end mt-2">
              <Link to="/forgetPassword" onClick={() => setShowLogin(false)}>
                Forgot Password?
              </Link>
            </div>

            <Button
              variant="danger"
              type="submit"
              className="w-100 mt-3 fw-semibold py-2"
            >
              Login
            </Button>

            <div className="d-flex align-items-center justify-content-center my-3">
              <span className="border-bottom w-100"></span>
              <span className="px-2 text-muted">OR</span>
              <span className="border-bottom w-100"></span>
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="outline-danger" className="w-50 me-2 d-flex align-items-center justify-content-center gap-2">
                <FcGoogle size={20} /> Google
              </Button>
              <Button variant="outline-primary" className="w-50 d-flex align-items-center justify-content-center gap-2">
                <FaLinkedin size={20} /> LinkedIn
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
