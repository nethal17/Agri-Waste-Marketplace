import { Navbar } from "../components/Navbar"
import { UserCircle } from "lucide-react"
import { Link } from "react-router-dom"

export const AdminDashboard = () => {

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        {/* Title Section */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Waste2Wealth Admin</h1>
        </div>

        {/* Management Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
            <Link to="/all-users">
            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            </Link>
        
            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">Order Management</h2>
            </div>

            <Link to="/final-summary">
            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">Financial Management</h2>
            </div>
            </Link>

            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">Transport Management</h2>
            </div>
            <Link to="/inventory-management">
            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">Inventory Management</h2>
            </div>
            </Link>
            <Link to="/review-manager">
            <div className={"p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer bg-green-600 text-white hover:shadow-2xl hover:bg-green-800"}>
              <h2 className="text-xl font-semibold">Review Management</h2>
            </div>
            </Link>
        </div>
      </main>
    </div>
    </>
  )
}