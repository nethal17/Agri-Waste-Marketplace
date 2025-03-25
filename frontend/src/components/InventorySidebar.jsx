import { Link } from "react-router-dom";

export const InventorySidebar = () => {
  return (
    <div className="p-8 text-white bg-zinc-900 w-[225px] text-lg">
      <ul>
        <div>
        <Link to="">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Waste Type Details</a>
        </li>
        </Link>

        <Link to="">
        <li className="mb-4">
          <a href="#" className="hover:text-green-600">Inventory Details</a>
        </li>
        </Link>
        </div>
        <div className="mt-[475px]">
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