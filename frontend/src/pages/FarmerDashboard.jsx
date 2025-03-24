import { Navbar } from "../components/Navbar";
import { ListingDetails } from "../components/ListingDetails";
import { Sidebar } from "../components/Sidebar";
import { ListingReviews } from "../components/ListingReviews";


export const FarmerDashboard = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-fit">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            Farmer Dashboard
        </div>
        <ListingDetails />
        <ListingReviews />

        </div>
    </div>
    </>
  );
};