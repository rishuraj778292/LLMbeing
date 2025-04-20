
import PublicLayout from "./layout/PublicLayout"
import Home from "./pages/Home"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import AuthLayout from "./layout/AuthLayout"

function App() {


  return (
    <div >
      <Routes>
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />
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
