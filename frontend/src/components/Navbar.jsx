import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { FaRegCircleUser } from "react-icons/fa6";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Check if `exp` exists and if the token is not expired
          if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    }, []);
  
    return isAuthenticated;
}

export const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload(); // Reload the page to update the UI
    };

    // Close dropdown when clicking outside
    useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

    return (
    <>
      
      <nav className="fixed top-0 z-50 flex items-center justify-between w-full p-5 text-lg font-light bg-green-100 shadow-lg">
        
        <div className="text-2xl font-bold text-zinc-900">Waste2Wealth</div>

        
        <div className="flex items-center space-x-6 text-zinc-900">

          <Link to="/" className="hover:text-green-600">Home</Link>

          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-green-600 focus:outline-none"
            >
              <div className="flex flex-row items-center hover:text-green-600">
                Our Services 
                <RiArrowDropDownLine size={30} />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 w-48 bg-white border rounded-lg shadow-lg top-8">
                <ul className="flex flex-col p-2">
                  <li>
                    <Link to="http://localhost:5173/organic-waste" className="block px-4 py-2 hover:bg-gray-100">
                      Buy Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/list-products" className="block px-4 py-2 hover:bg-gray-100">
                      List Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/transport-service" className="block px-4 py-2 hover:bg-gray-100">
                      Transport Service
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Link to="/contactus" className="hover:text-green-600">Contact Us</Link>
          <Link to="/about" className="hover:text-green-600">About Us</Link>
        </div>
        
        
        <div className="flex space-x-3">
            {isAuthenticated ? (
            <>
            <div className="relative" ref={dropdownRef}>
      
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="cursor-pointer hover:text-green-600 focus:outline-none"
      >
        <FaRegCircleUser size={30} />
      </button>

      
      {dropdownOpen && (
        <div className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg">
          <ul className="flex flex-col p-2">
            <li className="px-4 py-2 cursor-pointer hover:bg-green-600">
              <Link to="/profile">Profile Settings</Link>
            </li>
            <li 
              className="px-4 py-2 cursor-pointer hover:bg-green-600"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
            </>
            ) : (
            <>
            <Link to="/login">
            <button className="px-4 py-2 text-green-800 border border-green-800 rounded-lg cursor-pointer hover:bg-white">Sign in</button>
            </Link>
            <Link to="/register">
            <button className="px-4 py-2 text-white bg-green-600 rounded-lg cursor-pointer hover:bg-green-800">Sign up</button>
            </Link>
            </>
            )}
        </div>

      </nav>

      <div className="h-20"></div>
        </>
    );
};
