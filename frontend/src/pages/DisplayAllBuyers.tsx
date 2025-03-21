import Sidebar from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { Buyers } from "@/components/Buyers"

export const DisplayBuyer = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All Buyers
        </div>
        <Buyers />
        </div>
    </div>
    </>
  );
};