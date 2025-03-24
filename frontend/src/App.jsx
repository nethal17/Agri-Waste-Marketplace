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

import { OrganicWaste } from './pages/OrganicWaste';
import { NonOrganicWaste } from './pages/NonOrganicWaste';
import { CropResidues } from './pages/CropResidues';
import { FruitVegetable } from './pages/FruitVegetable';
import { PlantationWaste } from './pages/PlantationWaste';
import { NutSeedWaste } from './pages/NutSeedWaste';
import { LivestockDairyWaste } from './pages/LivestockDairyWaste';
import { AgroIndustrialWaste } from './pages/AgroIndustrialWaste';
import { ForestryWaste } from './pages/ForestryWaste';
import { PlasticWaste } from './pages/PlasticWaste';
import { MetalWaste } from './pages/MetalWaste';
import { FabricTextile } from './pages/FabricTextile';
import { GlassCeramic } from './pages/GlassCeramic';
import { ElectronicElectrical } from './pages/ElectronicElectrical';
import { RubberWaste } from './pages/RubberWaste';
import { ChemicalWaste } from './pages/ChemicalWaste';
import { Cart } from './pages/Cart';


import DriverList from './components/DriverList';
import DriverForm from './components/DriverForm';
import PaymentDetails from './components/PaymentDetails';
import StripePayment from './components/StripePayment';
import Success from './components/Success';
import PayHistory from './components/PayHistory';

import { AddOrderPage } from './pages/AddOrderPage';
import { AddReviewPage } from './pages/AddReviewPage';
import { InventoryManagerDashboard } from './pages/InventoryManagerDashboard';
import { InventoryPage } from './pages/InventoryPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ProductListingForm } from './pages/ProductListingForm';
import { ReviewManagerDashboard } from './pages/ReviewManagerDashboard';
import { FarmerDashboard } from './pages/FarmerDashboard';

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
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/table" element={<UsersTable />} />

      <Route path="/organic-waste" element={<OrganicWaste />} />
      <Route path="/non-organic" element={<NonOrganicWaste />} />
      <Route path="/organic/:waste_type" element={<CropResidues />} />
      <Route path="/organic/:waste_type" element={<FruitVegetable />} /> 
      <Route path="/organic/:waste_type" element={<PlantationWaste />} />
      <Route path="/organic/:waste_type" element={<NutSeedWaste />} /> 
      <Route path="/organic/:waste_type" element={<LivestockDairyWaste />} /> 
      <Route path="/organic/:waste_type" element={<AgroIndustrialWaste />} />
      <Route path="/organic/:waste_type" element={<ForestryWaste />} />
      <Route path="/non-organic/:waste_type" element={<ChemicalWaste />} />
      <Route path="/non-organic/:waste_type" element={<PlasticWaste />} />
      <Route path="/non-organic/:waste_type" element={<MetalWaste />} />
      <Route path="/non-organic/:waste_type" element={<FabricTextile />} />
      <Route path="/non-organic/:waste_type" element={<GlassCeramic />} />
      <Route path="/non-organic/:waste_type" element={<ElectronicElectrical />} />
      <Route path="/non-organic/:waste_type" element={<RubberWaste />} />
      <Route path="/cart" element={<Cart />} />
      

      <Route path="/driver" element={<DriverList />} />
      <Route path="/create" element={<DriverForm />} />
      <Route path="/driver/:id/payment" element={<PaymentDetails />} />
      <Route path="/payment" element={<StripePayment />} /> 
      <Route path="/success" element={<Success />} /> 
      <Route path="/pay-history" element={<PayHistory />} />

      <Route path="/add-order" element={<AddOrderPage />} />
      <Route path="/add-review" element={<AddReviewPage />} />
      <Route path="/inventory-dashboard" element={<InventoryManagerDashboard />}/>
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/listing-form" element={<ProductListingForm />} />
      <Route path="/review-manager" element={<ReviewManagerDashboard />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      
      
      

    </Routes>
  )
}

export default App;