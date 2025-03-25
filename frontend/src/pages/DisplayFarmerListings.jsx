import { FarmerSidebar } from "../components/FarmerSidebar";
import { Navbar } from "../components/Navbar";
import { ListingDetails } from "../components/ListingDetails";

export const DisplayFarmerListings = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-fit">
        <FarmerSidebar/>
        <div className="flex-grow p-4 overflow-auto">
        <ListingDetails />
        </div>
    </div>
    </>
  );
};