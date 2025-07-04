
const otpStore = new Map();
const storeOtp = (email, otp) => {
  const expires = Date.now() + 10 * 60 * 1000;
  const existing = otpStore.get(email) || [];
  otpStore.set(email, [...existing, { otp, expires }]);
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const isValidOtp = (email, otp) => {
  const storedOtps = otpStore.get(email) || [];
  const latestValid = storedOtps.filter((entry) => entry.expires > Date.now()).pop();
  return latestValid && latestValid.otp === otp;
};

const clearOtps = (email) => otpStore.delete(email);

module.exports = { storeOtp, isValidOtp, clearOtps,generateOTP };
