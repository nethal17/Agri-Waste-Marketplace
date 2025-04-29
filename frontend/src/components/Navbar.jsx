"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { RiArrowDropDownLine, RiMenu3Line, RiCloseLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"
import axios from "axios"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("token")
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error decoding token:", error)
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      }
    }
  }, [])

  return isAuthenticated
}

export const Navbar = () => {
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  const serviceDropdownRef = useRef(null)
  const userDropdownRef = useRef(null)
  const sidebarRef = useRef(null)
  const isAuthenticated = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
    window.location.reload()
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("No token found, please login again.")
          return
        }

        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        const userId = userData?._id

        if (!userId) {
          toast.error("User not found, please login again.")
          return
        }

        const response = await axios.get(`http://localhost:3000/api/auth/searchUser/${userId}`)
        setUser(response.data)
      } catch (error) {
        toast.error("Failed to fetch user data.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchUserData()
    }

    function handleClickOutside(event) {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setServiceDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isAuthenticated])

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "py-3 bg-green-100 shadow-lg" : "py-5 bg-gradient-to-r from-green-100 to-emerald-100"
        }`}
      >
        <div className="container flex items-center justify-between px-5 mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text">
              Waste2Wealth
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            id="menu-button"
            className="z-50 block transition-transform duration-200 ease-in-out md:hidden hover:scale-110"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              <RiCloseLine size={28} className="text-green-600" />
            ) : (
              <RiMenu3Line size={28} className="text-green-600" />
            )}
          </button>

          {/* Desktop Navigation Links */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link
              to="/"
              className="relative font-medium text-zinc-800 hover:text-green-600 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>

            {/* Services Dropdown - Desktop */}
            <div className="relative" ref={serviceDropdownRef}>
              <button
                onClick={() => {
                  setServiceDropdownOpen(!serviceDropdownOpen)
                  setUserDropdownOpen(false)
                }}
                className="relative flex flex-row items-center font-medium text-zinc-800 hover:text-green-600 focus:outline-none after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Our Services
                <RiArrowDropDownLine
                  size={30}
                  className={`transition-transform duration-300 ${serviceDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {serviceDropdownOpen && (
                <div className="absolute left-0 w-56 overflow-hidden bg-white rounded-lg shadow-xl top-10 animate-fadeIn">
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/organic-waste"
                        className="block px-6 py-3 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
                      >
                        Buy Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/product-listing-form"
                        className="block px-6 py-3 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
                      >
                        List Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/transport-service"
                        className="block px-6 py-3 transition-colors duration-200 hover:bg-green-50 hover:text-green-600"
                      >
                        Transport Service
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link
              to="/contactus"
              className="relative font-medium text-zinc-800 hover:text-green-600 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact Us
            </Link>
            <Link
              to="/about-us"
              className="relative font-medium text-zinc-800 hover:text-green-600 after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              About Us
            </Link>
          </div>

          {/* Desktop Auth Buttons / User Profile */}
          <div className="hidden space-x-4 md:flex">
            {isAuthenticated ? (
              <div className="relative flex items-center" ref={userDropdownRef}>
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen)
                    setServiceDropdownOpen(false)
                  }}
                  className="flex items-center gap-3 transition-transform duration-200 cursor-pointer hover:text-green-600 focus:outline-none hover:scale-105"
                >
                  <span className="hidden font-medium lg:inline text-zinc-800">
                    {loading ? "Loading..." : user?.email || "No Email"}
                  </span>
                  <div className="relative">
                    <img
                      className="object-cover w-10 h-10 transition-all duration-300 border-2 border-green-500 rounded-full shadow-md hover:border-green-600 hover:shadow-lg"
                      src={user.profilePic || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                      alt="Profile"
                    />
                    {userDropdownOpen && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                    )}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 w-56 overflow-hidden bg-white rounded-lg shadow-xl top-14 animate-fadeIn">
                    <div className="py-1 border-b border-gray-100"></div>
                    <ul className="py-2">
                      <li className="transition-colors duration-200 hover:bg-green-50">
                        <Link to="/profile" className="block px-6 py-2 text-zinc-800 hover:text-green-600">
                          Profile Settings
                        </Link>
                      </li>
                      <li className="transition-colors duration-200 hover:bg-green-50" onClick={handleLogout}>
                        <button className="block w-full px-6 py-2 text-left text-red-500 hover:text-red-600">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 font-medium text-green-600 transition-all duration-300 border-2 border-green-600 rounded-full hover:bg-green-50 hover:shadow-md">
                    Sign in
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2 font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-md">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-40 h-full w-[80%] max-w-[300px] bg-white shadow-xl transform transition-all duration-500 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 overflow-y-auto">
          {/* Mobile User Profile Section */}
          {isAuthenticated ? (
            <div className="flex flex-col items-center p-6 mb-4 border-b">
              <div className="relative p-1 mb-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                <img
                  className="object-cover w-16 h-16 rounded-full"
                  src={user.profilePic || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                  alt="Profile"
                />
              </div>
              <span className="mb-1 text-sm font-medium text-zinc-900">
                {loading ? "Loading..." : user?.email || "No Email"}
              </span>
              <div className="flex mt-3 space-x-2">
                <Link to="/profile" onClick={() => setSidebarOpen(false)}>
                  <button className="px-4 py-2 text-sm font-medium text-green-600 transition-colors duration-300 border border-green-600 rounded-full hover:bg-green-50">
                    Profile
                  </button>
                </Link>
                <button
                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-300 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    handleLogout()
                    setSidebarOpen(false)
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-6 mb-4 space-y-3 border-b">
              <Link to="/login" onClick={() => setSidebarOpen(false)}>
                <button className="w-full px-4 py-2 font-medium text-green-600 transition-all duration-300 border-2 border-green-600 rounded-full hover:bg-green-50">
                  Sign in
                </button>
              </Link>
              <Link to="/register" onClick={() => setSidebarOpen(false)}>
                <button className="w-full px-4 py-2 font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex flex-col px-4">
            <Link
              to="/"
              className="flex items-center py-4 border-b border-gray-100 text-zinc-800 hover:text-green-600"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="font-medium">Home</span>
            </Link>

            {/* Mobile Services Dropdown */}
            <div className="py-4 border-b border-gray-100">
              <button
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                className="flex items-center justify-between w-full font-medium text-zinc-800 hover:text-green-600 focus:outline-none"
              >
                <span>Our Services</span>
                <RiArrowDropDownLine
                  size={30}
                  className={`transform transition-transform duration-300 ${serviceDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {serviceDropdownOpen && (
                <div className="mt-2 ml-4 overflow-hidden animate-fadeIn">
                  <ul className="flex flex-col py-2 space-y-3">
                    <li>
                      <Link
                        to="/organic-waste"
                        className="block py-2 text-zinc-700 hover:text-green-600"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Buy Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/product-listing-form"
                        className="block py-2 text-zinc-700 hover:text-green-600"
                        onClick={() => setSidebarOpen(false)}
                      >
                        List Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/transport-service"
                        className="block py-2 text-zinc-700 hover:text-green-600"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Transport Service
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Link
              to="/contactus"
              className="flex items-center py-4 border-b border-gray-100 text-zinc-800 hover:text-green-600"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="font-medium">Contact Us</span>
            </Link>

            <Link
              to="/about-us"
              className="flex items-center py-4 border-b border-gray-100 text-zinc-800 hover:text-green-600"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="font-medium">About Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Spacer to push content below navbar */}
      <div className="h-20"></div>
    </>
  )
}