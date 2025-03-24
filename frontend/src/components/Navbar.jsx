import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { FaRegCircleUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
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
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [user, setUser] = useState({}); // ✅ Initialize user as an empty object
    const [loading, setLoading] = useState(true);

    const serviceDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // ✅ Remove user data as well
        navigate('/');
        window.location.reload();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("No token found, please login again.");
                    return;
                }
                
                const userData = JSON.parse(localStorage.getItem("user") || "{}");
                const userId = userData?._id;  // ✅ Use optional chaining to prevent errors
                
                if (!userId) {
                    toast.error("User not found, please login again.");
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/auth/searchUser/${userId}`);
                setUser(response.data);
            } catch (error) {
                toast.error("Failed to fetch user data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }

        function handleClickOutside(event) {
            if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
                setServiceDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [isAuthenticated]);

    return (
        <>
            <nav className="fixed top-0 z-50 flex items-center justify-between w-full p-5 text-lg font-light bg-green-100 shadow-lg">
                <div className="text-2xl font-bold text-zinc-900">Waste2Wealth</div>

                <div className="flex items-center space-x-6 text-zinc-900">
                    <Link to="/" className="hover:text-green-600">Home</Link>

                    {/* Services Dropdown */}
                    <div className="relative" ref={serviceDropdownRef}>
                        <button
                            onClick={() => {
                                setServiceDropdownOpen(!serviceDropdownOpen);
                                setUserDropdownOpen(false); // Close user dropdown if open
                            }}
                            className="hover:text-green-600 focus:outline-none"
                        >
                            <div className="flex flex-row items-center hover:text-green-600">
                                Our Services
                                <RiArrowDropDownLine size={30} />
                            </div>
                        </button>

                        {serviceDropdownOpen && (
                            <div className="absolute left-0 w-48 bg-white border rounded-lg shadow-lg top-8">
                                <ul className="flex flex-col p-2">
                                    <li>
                                        <Link to="/organic-waste" className="block px-4 py-2 hover:bg-gray-100">
                                            Buy Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/product-listing-form" className="block px-4 py-2 hover:bg-gray-100">
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
                        <div className="relative flex items-center" ref={userDropdownRef}>
                            <button
                                onClick={() => {
                                    setUserDropdownOpen(!userDropdownOpen);
                                    setServiceDropdownOpen(false);
                                }}
                                className="flex items-center cursor-pointer hover:text-green-600 focus:outline-none"
                            > 
                              <div className="flex items-center gap-3">
                                <span>{loading ? "Loading..." : user?.email || "No Email"}</span>
                                <img
                                  className="object-cover w-[50px] h-[50px] border-2 border-green-600 rounded-full shadow-md"
                                  src={user.profilePic || "https://via.placeholder.com/150"}
                                  alt="Profile"
                                />
                              </div>
                                
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 w-48 bg-white border rounded-md shadow-lg mt-[140px]">
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
