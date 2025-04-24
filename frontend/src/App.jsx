
import PublicLayout from "./layout/PublicLayout"
import Home from "./pages/Home"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import AuthLayout from "./layout/AuthLayout"
import ProtectedLayout from "./layout/ProtectedLayout"
import Dashboard from "./pages/Dashboard"
import ContactUs from "./components/ContactUs"


function App() {
  return (
    <div >
      <Routes>
        {/* public layout for unautrhencticate user */}
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/contactus" element={<ContactUs/>}/>
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={ <Dashboard/>} />
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
