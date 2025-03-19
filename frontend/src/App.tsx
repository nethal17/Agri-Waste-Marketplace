import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { OTPVerification } from "./pages/OTPverification";
import { Dashboard } from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";


import InventoryPage from "./pages/InventoryPage";
import ManagerDashboard from "./pages/InventoryManagerDashboard";
import ProductListingForm from "./pages/ProductListingForm";


function App() {
  return (
    <Routes>
      {/* Nethal */}
      <Route path="/" element={<Home />} />
      <Route path="/nav" element={<Navbar />} />
      <Route path="/dash" element={<Dashboard />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/otp" element={<OTPVerification />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/addproduct" element={<ProductListingForm />} />
      
    </Routes>
  );
}

export default App;