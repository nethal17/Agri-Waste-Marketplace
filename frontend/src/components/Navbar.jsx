import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const serviceDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    const sidebarRef = useRef(null);
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
        <nav className="h-16 bg-green-100 shadow-lg">
            <div className="flex items-center justify-between h-full px-5">
                {/* Logo */}
                <div className="text-2xl font-bold text-zinc-900">
                    Waste2Wealth
                </div>

                {/* Desktop Navigation Links */}
                <div className="items-center hidden space-x-6 md:flex text-zinc-900">
                    <Link to="/" className="hover:text-green-600">
                        Home
                    </Link>

                    {/* Services Dropdown */}
                    <div className="relative" ref={serviceDropdownRef}>
                        <button
                            onClick={() => {
                                setServiceDropdownOpen(!serviceDropdownOpen);
                                setUserDropdownOpen(false);
                            }}
                            className="hover:text-green-600 focus:outline-none"
                        >
                            <div className="flex items-center hover:text-green-600">
                                Our Services
                                <RiArrowDropDownLine size={30} />
                            </div>
                        </button>

                        {serviceDropdownOpen && (
                            <div className="absolute left-0 w-48 bg-white border rounded-lg shadow-lg top-12">
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

                    <Link to="/contactus" className="hover:text-green-600">
                        Contact Us
                    </Link>
                    <Link to="/about" className="hover:text-green-600">
                        About Us
                    </Link>
                </div>

                {/* User Profile */}
                <div className="relative" ref={userDropdownRef}>
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                setUserDropdownOpen(!userDropdownOpen);
                                setServiceDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 hover:text-green-600 focus:outline-none"
                        >
                            <span className="hidden lg:inline">
                                {loading ? "Loading..." : user?.email || "No Email"}
                            </span>
                            <img
                                className="object-cover w-10 h-10 border-2 border-green-600 rounded-full shadow-md"
                                src={user.profilePic || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                                alt="Profile"
                            />
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {userDropdownOpen && (
                        <div className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg top-12">
                            <ul className="flex flex-col p-2">
                                <li>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                                        Profile Settings
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="z-50 block md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? (
                        <RiCloseLine size={28} className="text-zinc-900" />
                    ) : (
                        <RiMenu3Line size={28} className="text-zinc-900" />
                    )}
                </button>
            </div>
        </nav>
    );
};
