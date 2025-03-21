import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
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

export function Navbar() {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload(); // Reload the page to update the UI
    };

    return (
        <nav className="flex items-center justify-between px-6 py-5 bg-green-100 shadow-md">
            {/* Brand Name */}
            <div className="text-2xl font-bold text-zinc-900">Waste2Wealth</div>

            {/* Navigation Links */}
            <ul className="flex space-x-6 text-zinc-900">
                <Link to="/">
                <li className="cursor-pointer hover:text-green-600">Home</li>
                </Link>

                {/* Dropdown Menu for "Our Services" */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer hover:text-green-600">
                        Our Services
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="mt-2 bg-white shadow-lg border rounded-md">
                        <DropdownMenuItem className="px-4 py-2 hover:bg-green-600 cursor-pointer">
                            <Link to="/orderHistory">
                            Buy Products
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-green-600 cursor-pointer">
                            <Link to="/addproduct">
                            List Products
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="px-4 py-2 hover:bg-green-600 cursor-pointer">
                            Transport Service
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <li className="cursor-pointer hover:text-green-600">Contact Us</li>
                <li className="cursor-pointer hover:text-green-600">About Us</li>
            </ul>

            {/* Authentication Buttons */}
            <div className="flex space-x-3">
                {isAuthenticated ? (
                    <>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer hover:text-green-600">
                            <FaRegCircleUser size={30} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="mt-2 bg-white shadow-lg border rounded-md">
                            <DropdownMenuItem className="px-4 py-2 hover:bg-green-600 cursor-pointer">
                                <Link to="/profile">
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="px-4 py-2 hover:bg-green-600 cursor-pointer"
                                onClick={handleLogout}>
                            
                                Logout
                                
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </>
                    
                ) : (
                    <>
                        <Link to="/auth/login">
                            <Button className="cursor-pointer bg-green-600 text-white">Sign in</Button>
                        </Link>
                        <Link to="/auth/signup">
                            <Button className="cursor-pointer bg-green-600 text-white">Sign up</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}