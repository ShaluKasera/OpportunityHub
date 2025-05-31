import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaLinkedin } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job_seeker");
  const [error, setError] = useState(null);

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
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  const logout = () => {
    alert("Logged out");
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
        <Dropdown.Item as={Link} to="/profile" className="link">
          My Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={logout}
          className="d-flex align-items-center justify-content-between link"
          style={{ cursor: "pointer" }}
        >
          Logout
          <IoLogOutOutline className="ms-2" size={20} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <header className="bg-gray-100 text-white py-7 px-24 flex justify-between items-center">
      <div className="text-4xl Zen_Dots font-bold text-black">
        Job<span className="text-red-700">Hunt</span>
      </div>

      {user?.role === "job_seeker" && (
        <ul className="flex space-x-6 items-center">
          <li><Link to="/" className="link">Home</Link></li>
          <li><Link to="/job" className="link">Jobs</Link></li>
          <li><ProfileMenu /></li>
        </ul>
      )}

      {user?.role === "employer" && (
        <ul className="flex space-x-6 items-center">
          <li><Link to="/" className="link">Dashboard</Link></li>
          <li><Link to="/post-job" className="link">Post Job</Link></li>
          <li><Link to="/manage-jobs" className="link">Job Applications</Link></li>
          <li><ProfileMenu /></li>
        </ul>
      )}

      {!user && (
        <ul className="flex space-x-6 items-center">
          <li><Link to="/" className="link">Home</Link></li>
          <li><Link to="/" className="link">Jobs</Link></li>
          <li>
            <button className="link bg-transparent border-0 p-0" onClick={() => setShowLogin(true)}>
              Login
            </button>
          </li>
          <li><Link to="/signup" className="link">Signup</Link></li>
        </ul>
      )}

      <Modal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        centered
        dialogClassName="modal-90w"
        contentClassName="p-3 rounded-xl"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <div className="w-full">
            <p className="text-4xl text-center font-semibold text-gray-800 Ysabeau_Infant">
              Login
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Don’t have an account?{" "}
              <Link to="/signup" className="link">Register now</Link>
            </p>
          </div>
        </Modal.Header>

        <Modal.Body className="pt-0">
          <Form onSubmit={handleLoginSubmit} className="space-y-4">

            <Form.Group controlId="formBasicEmail">
              <Form.Label className="text-sm text-gray-700">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg shadow-sm"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="text-sm text-gray-700">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg shadow-sm"
                required
              />
            </Form.Group>

            <div className="flex justify-end text-sm">
              <Link to="/forgetPassword" className="link">Forgot Password?</Link>
            </div>

            <Button variant="outline-danger" type="submit" className="w-full font-semibold mb-2 py-2 rounded-lg">
              Login
            </Button>

            {error && (
              <div className="alert alert-danger text-sm py-2 px-3">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 my-3">
              <span className="h-px w-full bg-gray-300"></span>
              <span className="text-sm text-gray-500">OR</span>
              <span className="h-px w-full bg-gray-300"></span>
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="outline-danger" className="flex-grow-1 me-2 d-flex align-items-center justify-content-center gap-2">
                <FcGoogle size={20} /> Google
              </Button>
              <Button variant="outline-primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                <FaLinkedin size={20} /> LinkedIn
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;
