import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { AllUsers } from "../components/AllUsers";

export const DisplayAllUsers = () => {
  return (
    <>
    <Navbar />
    <div className="flex h-fit">
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