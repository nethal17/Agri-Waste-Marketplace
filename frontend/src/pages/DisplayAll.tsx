import Sidebar from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { AllUsers } from "@/components/AllUsers";

export const DisplayAll = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All System Users
        </div>
        <AllUsers />
        </div>
    </div>
    </>
  );
};