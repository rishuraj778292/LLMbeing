
import PublicLayout from "./layout/PublicLayout"
import Home from "./pages/Home"
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import OTPVerification from "./pages/authentication/OTPVerification"
import ResetPassword from "./pages/authentication/ResetPassword"
import AuthLayout from "./layout/AuthLayout"
import ProtectedLayout from "./layout/ProtectedLayout"

import Messages from "./pages/protectedPages/Messages"
import Gigs from "./pages/protectedPages/Gigs"
import Profile from "./pages/protectedPages/Profile/Profile"
import Dashboard from "./pages/protectedPages/Dashboard"
import { useSelector, useDispatch } from "react-redux"
import { verifyme } from "../Redux/Slice/authSlice"
import Accountsetting from "./pages/protectedPages/Accountsetting"
import ProjectsLayout from "./pages/protectedPages/projectsPages/ProjectsLayout"
import FindProjectsPage from "./pages/FindProjectsPage"
import SavedProjects from "./pages/protectedPages/projectsPages/SavedProjects"
import AppliedProjects from "./pages/protectedPages/projectsPages/AppliedProjects"
import CurrentProjects from "./pages/protectedPages/projectsPages/CurrentProjects"
import CompletedProjects from './pages/protectedPages/projectsPages/CompletedProjects'
import ProjectPostingForm from "./pages/protectedPages/projectsPages/ProjectPostingForm"
import ContactUs from "./pages/ContactUs"
import AboutUs from "./pages/AboutUs"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfUsePage from "./pages/TermsOfUsePage"
import ProjectDetailsPage from "./pages/ProjectDetailsPage"
import ProjectApplicationPage from "./pages/ProjectApplicationPage"

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasInitialized, setHasInitialized] = useState(false);
  const { isAuthenticated, verifyStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyme());
  }, [dispatch]);

  // Mark as initialized after first verification attempt
  useEffect(() => {
    if (verifyStatus !== 'idle') {
      setHasInitialized(true);
    }
  }, [verifyStatus]);

  useEffect(() => {
    // Only redirect after the app has been initialized and verification is complete
    if (!hasInitialized) {
      return;
    }

    // Only perform redirects after verification is complete (succeeded or failed)
    if (verifyStatus === 'succeeded' && isAuthenticated) {
      // Only redirect to dashboard if user is on auth pages or home page
      const authPages = ['/login', '/signup', '/forgot-password', '/forgotpassword', '/otp-verification', '/reset-password'];
      const publicPages = ['/', '/contactus', '/about-us', '/privacy-policy', '/term-of-usage'];

      if (authPages.includes(location.pathname) || publicPages.includes(location.pathname)) {
        navigate("/dashboard");
      }
    }

    // If verification failed and user is on protected routes, redirect to login
    if (verifyStatus === 'failed' && !isAuthenticated) {
      const protectedRoutes = ['/dashboard', '/projects', '/manage-projects', '/profile', '/messages', '/gigs', '/post-project'];
      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyStatus, isAuthenticated, location.pathname, hasInitialized]);



  return (
    <div >
      <Routes>
        {/* for loggedin user and logged out both */}
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/term-of-usage" element={<TermsOfUsePage />} />
        {/* public layout for unautrhencticate user */}
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />



        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account-setting" element={<Accountsetting />} />
          <Route path="/projects" element={<FindProjectsPage />} />
          <Route path="/project/:slug" element={<ProjectDetailsPage />} />
          <Route path="/project/:slug/apply" element={<ProjectApplicationPage />} />
          <Route path="/manage-projects" element={<ProjectsLayout />}>
            <Route index element={<CurrentProjects />} />
            <Route path="saved" element={<SavedProjects />} />
            <Route path="applied" element={<AppliedProjects />} />
            <Route path="current" element={<CurrentProjects />} />
            <Route path="completed" element={<CompletedProjects />} />
          </Route>
          <Route path="/post-project" element={<ProjectPostingForm />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="otp-verification" element={<OTPVerification />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
