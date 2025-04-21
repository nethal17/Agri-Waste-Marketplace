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
import { StartList } from './pages/StartList';

import { OrganicWaste } from './pages/OrganicWaste';
import { NonOrganicWaste } from './pages/NonOrganicWaste';
import { CropResidues } from './pages/CropResidues';
/*import { FruitVegetable } from './pages/FruitVegetable';
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
import { RubberWaste } from './pages/RubberWaste';*/
import { ChemicalWaste } from './pages/ChemicalWaste';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { BuyerAddressForm } from './pages/BuyerAddressForm';


import DriverList from './components/DriverList';
import DriverForm from './components/DriverForm';
import PaymentDetails from './components/PaymentDetails';
import StripePayment from './components/StripePayment';
import Success from './components/Success';
import PayHistory from './components/PayHistory';
import HighPayments from './components/HighPayments';
import Final from './components/Final';


import { AddOrderPage } from './pages/AddOrderPage';
import { AddReviewPage } from './pages/AddReviewPage';
import { InventoryManagerDashboard } from './pages/InventoryManagerDashboard';
import { InventoryPage } from './pages/InventoryPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ReviewManagerDashboard } from './pages/ReviewManagerDashboard';
import { ProductListingForm } from './pages/ProductListingForm';
import { DisplayFarmerListings } from './pages/DisplayFarmerListings';
import { DisplayFarmerReviews } from './pages/DisplayFarmerReviews';

import Delivery from './pages/Delivery';
import TruckDriverDashboard from './pages/TruckDriverDashboard';
import FarmerReqForm from './pages/FarmerReqForm';



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
      <Route path="/start-listing" element={<StartList />} />

      <Route path="/organic-waste" element={<OrganicWaste />} />
      <Route path="/non-organic" element={<NonOrganicWaste />} />
      <Route path="/organic/:waste_type" element={<CropResidues />} />
      <Route path="/non-organic/:waste_type" element={<ChemicalWaste />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/buyer-address-form" element={<BuyerAddressForm />} />
      

      <Route path="/driver" element={<DriverList />} />
      <Route path="/create" element={<DriverForm />} />
      <Route path="/driver/:id/payment" element={<PaymentDetails />} />
      <Route path="/payment" element={<StripePayment />} /> 
      <Route path="/success" element={<Success />} /> 
      <Route path="/pay-history" element={<PayHistory />} />
      <Route path="/high-payments" element={<HighPayments />} />
      <Route path="/final-summary" element={<Final />} />

      <Route path="/add-order" element={<AddOrderPage />} />
      <Route path="/add-review" element={<AddReviewPage />} />
      <Route path="/inventory-dashboard" element={<InventoryManagerDashboard />}/>
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/review-manager" element={<ReviewManagerDashboard />} />

      
      
      <Route path='/Delivery' element={<Delivery/>} />
      <Route path='/truck-dashboard' element={<TruckDriverDashboard/>} />
      <Route path='/farmer-ReqForm' element={<FarmerReqForm/>} />
      <Route path="/product-listing-form" element={<ProductListingForm />} />
      <Route path="/farmer-listings" element={<DisplayFarmerListings />} /> 
      <Route path="/farmer-reviews" element={<DisplayFarmerReviews />} /> 

  
    </Routes>
  )
}

export default App;