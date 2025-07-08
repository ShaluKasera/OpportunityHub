import { useEffect, useState } from "react";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
    window.location.reload(); // Reload so AuthProvider runs fetchUserData
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 text-white p-4 rounded-xl shadow-lg z-50 flex flex-col md:flex-row justify-between items-center gap-2">
      <p className="text-sm">
        We use cookies to improve your experience. By accepting, you agree to our cookie policy.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
