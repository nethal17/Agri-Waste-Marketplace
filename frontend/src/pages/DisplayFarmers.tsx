import Sidebar from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { Farmers } from "@/components/Farmers"

export const DisplayFarmers = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All Farmers
        </div>
        <Farmers />
        </div>
    </div>
    </>
  );
};