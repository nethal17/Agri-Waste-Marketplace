import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="p-8 text-white bg-zinc-900 w-[225px] text-lg">
      <ul>
        <div>
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
        </div>
        
        <div className="mt-[450px]">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Profile Settings</a>
        </li>
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Log Out</a>
        </li>
        </div>
      </ul>
    </div>
  );
};