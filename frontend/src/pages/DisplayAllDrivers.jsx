import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { AllDrivers } from "../components/AllDrivers";

export const DisplayAllDrivers = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
        <div className="text-center text-3xl text-bold p-3">
            All Drivers
        </div>
        <AllDrivers />
        </div>
    </div>
    </>
  );
};