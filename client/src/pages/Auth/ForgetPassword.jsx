import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post("http://localhost:8000/api/user/forgot-password", {
        email,
        name: email.split("@")[0], 
      });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setStep(3);
  };

  const handlePasswordSubmit = async () => {
    const enteredOtp = otp.join("");

    if (passwords.newPass !== passwords.confirmPass) {
      alert("Passwords do not match");
      return;
    }

    if (passwords.newPass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/user/reset-password", {
        email,
        otp: enteredOtp,
        newPassword: passwords.newPass,
      });

      alert(response.data.message);
      setStep(4);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
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
              className="w-full border px-4 py-2 mb-4 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button
              onClick={sendOtp}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
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
                  className="w-10 h-10 text-center border rounded text-lg"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              disabled={loading}
            >
              Verify OTP
            </button>
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
                className="w-full border px-4 py-2 rounded mt-1"
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
                className="w-full border px-4 py-2 rounded mt-1"
                placeholder="Confirm new password"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
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
