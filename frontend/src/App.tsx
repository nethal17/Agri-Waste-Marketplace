import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import { OTPVerification } from "./pages/OTPverification"
import { Dashboard } from "./pages/Dashboard"
import { Navbar } from "./components/Navbar"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nav" element={<Navbar />} />
      <Route path="/dash" element={<Dashboard />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/otp" element={<OTPVerification />} />
    </Routes>
  )
}

export default App
