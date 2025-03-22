import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { AllBuyers } from "../components/AllBuyers";

export const DisplayAllBuyers = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All Buyers
        </div>
        <AllBuyers />
        </div>
    </div>
    </>
  );
};