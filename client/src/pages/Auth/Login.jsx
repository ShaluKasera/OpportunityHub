import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Modal, Button, Form } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";
const Login = ({ show, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/user/login", { email, password });
      const { user: userData, employer, jobSeeker } = res.data;

      const loggedInUser = {
        ...userData,
        profileData: userData.role === "employer" ? employer : jobSeeker,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("role", userData.role);

      onLoginSuccess(loggedInUser);
      const pathname = window.location.pathname;
      toast.success("Login successful!", { id: `success-${pathname}` });
      onClose();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log("Login error: ", err);
      if (
        err.response?.data?.message ===
        "Email not verified. Please verify your email."
      ) {
        setTimeout(() => {
          navigate("/verify-email", { state: { email } });
        }, 1500);
      }
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="modal-90w"
      contentClassName="p-3 rounded-xl"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="w-100 -mb-6">
          <p className="fs-3 text-center fw-bold text-gray-800">Login</p>
          <p className="text-muted small text-center">
            Don’t have an account?{" "}
            <Link to="/signup" onClick={onClose} className="!no-underline ">
              Register now
            </Link>
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleLoginSubmit}>
          <Form.Group controlId="formBasicEmail">
            <TextField
              fullWidth
              label="Enter Your Registered Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              color="error"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="-mt-2">
            <TextField
              fullWidth
              label="Enter Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              color="error"
              required
            />
          </Form.Group>

          <div className="text-end small">
            <Link
              to="/forgetPassword"
              onClick={onClose}
              className="!no-underline"
            >
              Forgot Password?
            </Link>
          </div>
          {loading ? (
            <Loading width="100%" />
          ) : (
            <button
              className="red-button"
              type="submit"
              disabled={loading}
            >Login</button>
          )}

          <div className="d-flex align-items-center justify-content-center my-3">
            <span className="border-bottom w-100"></span>
            <span className="px-2 text-muted">OR</span>
            <span className="border-bottom w-100"></span>
          </div>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-danger"
              className="w-50 me-2 d-flex align-items-center justify-content-center gap-2"
            >
              <FcGoogle size={20} /> Google
            </Button>
            <Button
              variant="outline-primary"
              className="w-50 d-flex align-items-center justify-content-center gap-2"
            >
              <FaLinkedin size={20} /> LinkedIn
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
