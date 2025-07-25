import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Signup from "./pages/Auth/Signup";
import Detail from "./pages/Jobs/Detail";
import Profile from "./pages/Auth/Profile";
import EmailVerification from "./pages/Auth/EmailVerification";
import JobPage from "./pages/Jobs/JobPage";
import PostJob from "./pages/Employer/PostJob";
import AppliedJobDetail from "./pages/Seeker/AppliedJobDetail";
import OfferedJobDetails from "./pages/Seeker/OfferedJobDetails";
import PostedJobDetail from "./pages/Employer/PostedJobDetail";
import ApplicationsDetail from "./pages/Employer/Applicationsdetails";
import Dashboard from "./pages/Employer/Dashboard/Dashboard";
import ManageApplication from "./pages/Employer/ManageApplications/ManageApplication";
import CookieConsentBanner from "./components/CookieConsentBanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/job-details/:id" element={<Detail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route
          path="/applied-job-details/:jobId"
          element={<AppliedJobDetail />}
        />
        <Route
          path="/offered-job-details/:id"
          element={<OfferedJobDetails />}
        />
        <Route path="/posted-job/:jobId" element={<PostedJobDetail />} />
        <Route
          path="/application-detail/:jobId"
          element={<ApplicationsDetail />}
        />

        <Route path="/employer-dashboard" element={<Dashboard />} />
        <Route path="/manage-applications" element={<ManageApplication />} />
      </Routes>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
