import React, { useState } from "react";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import Loading from "../../components/Loading";
const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);
  const pathname = window.location.pathname;
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    const { key } = e;

    if (key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (key === "ArrowRight" && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`$/user/forgot-password`, {
        email,
        name: email.split("@")[0],
      });
      toast.success(response.data.message, { id: `success-${pathname}` });
      setStep(2);
    } catch (error) {
      console.log("send OTP error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        id: `err-error-${pathname}`,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );
      toast.success(response.data.message, { id: `success-${pathname}` });
      setStep(3);
    } catch (error) {
      console.log("OTP verification failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    const enteredOtp = otp.join("");

    if (passwords.newPass !== passwords.confirmPass) {
      toast.error("Passwords do not match", { id: `err-error-${pathname}` });
      return;
    }

    if (passwords.newPass.length < 6) {
      toast.error("Password must be at least 6 characters", {
        id: `err-error-${pathname}`,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/reset-password`,
        {
          email,
          otp: enteredOtp,
          newPassword: passwords.newPass,
        }
      );

      toast.success(response.data.message, { id: `success-${pathname}` });
      setStep(4);
    } catch (error) {
      tconsole.log("Failed to reset password: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-[80%] md:w-[60%] lg:w-[30%] mt-20 border p-8 rounded shadow-lg bg-white">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Forgot Password
            </h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter your email address
            </label>
            <input
              type="email"
              className="w-full input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {loading ? (
              <Loading width="100%"  />
            ) : (
              <button
                onClick={sendOtp}
                className="red-button"
                disabled={loading}
              >
                Send OTP
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Enter OTP
            </h2>
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
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-10 input"
                />
              ))}
            </div>
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={verifyOtp}
                className="red-button"
                disabled={loading}
              >
                Verify OTP
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Reset Password
            </h2>
            <div className="mb-4 relative">
              <label className="text-sm font-medium">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPass: e.target.value })
                }
                className="w-full input"
                placeholder="Enter new password"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-4 relative">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirmPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPass: e.target.value })
                }
                className="w-full input"
                placeholder="Confirm new password"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {loading ? (
              <Loading  width="100%"/>
            ) : (
              <button
                onClick={handlePasswordSubmit}
                className="w-full red-button"
                disabled={loading}
              >
                {" "}
                Update Password
              </button>
            )}
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-700">
              Password Changed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You can now login with your new password.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ForgetPassword;
