import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/authContext";
import Loading from "../../components/Loading";

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(600);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const otpTimerRef = useRef(null);
  const resendTimerRef = useRef(null);

  if (!email) {
    return (
      <Layout>
        <p className="text-red-600 text-center mt-10">
          Email is missing. Please go back and try again.
        </p>
      </Layout>
    );
  }

  // OTP countdown
  useEffect(() => {
    if (otpExpiresIn <= 0) return;

    otpTimerRef.current = setInterval(() => {
      setOtpExpiresIn((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(otpTimerRef.current);
  }, [otpExpiresIn]);

  // Resend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return;

    resendTimerRef.current = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(resendTimerRef.current);
  }, [resendTimer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    const newOtp = [...otp];

    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
      setOtp(newOtp);
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await axios.post("/user/verify-email", {
        email,
        otp: otp.join(""),
      });

      toast.success(response.data.message);

      // Optionally update global user context
      if (setUser && response.data.user) {
        setUser(response.data.user);
      }

      navigate("/");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtpHandler = async () => {
    if (resendTimer > 0) return;
    setResendOtpLoading(true);

    try {
      setResendTimer(30);
      setOtpExpiresIn(600);
      setOtp(new Array(6).fill(""));

      const response = await axios.post("/user/resend-otp", { email });

      toast.success(response.data.message);
    } catch (error) {
      console.log("Resend otp error: ", error);
    } finally {
      setResendOtpLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Layout>
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
          {isVerifying ? (
            <Loading color="danger" />
          ) : (
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              disabled={isVerifying}
            >
              Verify Email
            </button>
          )}

          <p className="mt-3 text-center text-gray-600 text-sm">
            OTP expires in:{" "}
            <span className="font-semibold">{formatTime(otpExpiresIn)}</span>
          </p>

          <div className="mt-4 text-center">
            {resendOtpLoading ? (
              <Loading color="danger" />
            ) : (
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
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EmailVerification;
