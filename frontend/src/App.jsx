import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Profile } from './pages/Profile';
import { UpdateDetails } from './pages/UpdateDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { DisplayAllUsers } from './pages/DisplayAllUsers';
import { DisplayAllFarmers } from './pages/DisplayAllFarmers';
import { DisplayAllBuyers } from './pages/DisplayAllBuyers';
import { DisplayAllDrivers } from './pages/DisplayAllDrivers';
import { ContactUs } from './pages/ContactUs';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from "./pages/ResetPassword";


import { AddOrderPage } from './pages/AddOrderPage';
import { AddReviewPage } from './pages/AddReviewPage';
import { InventoryManagerDashboard } from './pages/InventoryManagerDashboard';
import { InventoryPage } from './pages/InventoryPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProductListingForm } from './pages/ProductListingForm';
import { ReviewManagerDashboard } from './pages/ReviewManagerDashboard';

import UsersTable from './pages/UserTable';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/update-details" element={<UpdateDetails />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/all-users" element={<DisplayAllUsers />} />
      <Route path="/all-buyers" element={<DisplayAllBuyers />} />
      <Route path="/all-farmers" element={<DisplayAllFarmers />} />
      <Route path="/all-drivers" element={<DisplayAllDrivers />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/table" element={<UsersTable />} />

      <Route path="/add-order" element={<AddOrderPage />} />
      <Route path="/add-review" element={<AddReviewPage />} />
      <Route path="/inventory-dashboard" element={<InventoryManagerDashboard />}/>
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/listing-form" element={<ProductListingForm />} />
      <Route path="/review-manager" element={<ReviewManagerDashboard />} />

    </Routes>
  )
}

export default App;