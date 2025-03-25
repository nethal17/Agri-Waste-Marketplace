import { Link, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };
  
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
          <button
            className="hover:text-green-600"
            onClick={() => navigate("/profile")}
          >
            Profile Settings
          </button>
        </li>
        <li className="mb-4">
          <button 
            className="hover:text-green-600"
            onClick={handleLogout}>
            Log Out
          </button>
        </li>
        </div>
      </ul>
    </div>
  );
};