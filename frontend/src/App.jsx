
import PublicLayout from "./layout/PublicLayout"
import Home from "./pages/Home"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useEffect } from "react"

import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import AuthLayout from "./layout/AuthLayout"
import ProtectedLayout from "./layout/ProtectedLayout"
import Dashboard from "./pages/protectedPages/Dashboard"
import Project from "./pages/protectedPages/Project"
import Messages from "./pages/protectedPages/Messages"
import Gigs from "./pages/protectedPages/Gigs"
import Profile from "./pages/protectedPages/Profile"
import ContactUs from "./pages/ContactUs"
import { useSelector, useDispatch } from "react-redux"
import { verifyme } from "../Redux/Slice/authSlice"
import Accountsetting from "./pages/protectedPages/Accountsetting"
//import { setAxiosDispatch } from "../UTILS/axiosInstance"

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyme());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [status, isAuthenticated, navigate]);



  return (
    <div >
      <Routes>
        {/* public layout for unautrhencticate user */}
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />

          <Route path="/contactus" element={<ContactUs />} />

        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account-setting" element={<Accountsetting />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
