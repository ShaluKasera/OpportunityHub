import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(600); // 10 minutes in seconds
  const [resendTimer, setResendTimer] = useState(0); // 30 sec cooldown
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const intervalRef = useRef(null);
  const resendIntervalRef = useRef(null);

  if (!email) {
    return (
      <Layout>
        <p className="text-red-600 text-center mt-10">
          Email is missing. Please go back and try again.
        </p>
      </Layout>
    );
  }

  // OTP expiry countdown (10 minutes)
  useEffect(() => {
    if (otpExpiresIn <= 0) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setOtpExpiresIn((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [otpExpiresIn]);

  // Resend button cooldown timer (30 sec)
  useEffect(() => {
    if (resendTimer <= 0) {
      clearInterval(resendIntervalRef.current);
      return;
    }

    resendIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(resendIntervalRef.current);
  }, [resendTimer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only digits
    const newOtp = [...otp];

    if (value) {
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const enteredOtp = otp.join("");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-email`,
        { email, otp: enteredOtp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.info(response.data.message);

      if (
        response.data.message === "Email verified successfully" ||
        response.data.message === "Email is already verified"
      ) {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtpHandler = async () => {
    if (resendTimer > 0) return; // prevent spamming

    try {
      setResendTimer(30); // start 30 sec cooldown
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/resend-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      setOtpExpiresIn(600); // reset OTP expiry timer to 10 minutes
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  // Format timer mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
        <form onSubmit={verifyOtp}>
          <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            We sent a 6-digit OTP to <strong>{email}</strong>
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="\d{1}"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                className="w-10 h-10 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>

          <p className="mt-3 text-center text-gray-600 text-sm">
            OTP expires in: <span className="font-semibold">{formatTime(otpExpiresIn)}</span>
          </p>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={resendOtpHandler}
              disabled={resendTimer > 0}
              className={`px-4 py-2 rounded ${
                resendTimer > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EmailVerification;
