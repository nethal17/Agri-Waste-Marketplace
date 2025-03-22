import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { AllFarmers } from "../components/AllFarmers";

export const DisplayAllFarmers = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All Farmers
        </div>
        <AllFarmers />
        </div>
    </div>
    </>
  );
};