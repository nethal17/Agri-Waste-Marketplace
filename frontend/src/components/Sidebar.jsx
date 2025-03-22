import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="w-50 bg-zinc-900 text-white p-6">
      <ul>
        <Link to="/all-users">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">All Users</a>
        </li>
        </Link>

        <Link to="/all-farmers">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Farmers</a>
        </li>
        </Link>

        <Link to="/all-buyers">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Buyers</a>
        </li>
        </Link>

        <Link to="/all-drivers">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Truck Drivers</a>
        </li>
        </Link>

        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Organic Fertilizer Sellers</a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Recycling Companies</a>
        </li>
        <br></br> <br></br> <br></br> <br></br> <br></br> <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Settings</a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Log Out</a>
        </li>
      </ul>
    </div>
  );
};