import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaTruck, 
  FaShoppingCart, FaUserShield, FaBell, FaLanguage, FaPalette, 
  FaLock, FaHistory, FaChartLine, FaTrophy, FaShieldAlt, FaClock 
} from "react-icons/fa";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [stats, setStats] = useState({
    listings: 0,
    orders: 0,
    pickups: 0,
    rating: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found, please login again.");
          return;
        }
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id;
        const response = await axios.get(`http://localhost:3000/api/auth/searchUser/${userId}`);
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image || !user) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", image);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/photo/upload-profile-pic/${user._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUser((prevUser) => ({ ...prevUser, profilePic: response.data.profilePic }));
      toast.success("Profile picture updated successfully!");
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">No user data found</h2>
          <p className="mt-2 text-gray-500">Please try logging in again</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card - Left Side */}
            <div className="lg:col-span-1 space-y-8">
              {/* Profile Info Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        className="w-32 h-32 rounded-full border-4 border-green-500 object-cover"
                        src={imagePreview || user.profilePic || "https://via.placeholder.com/150"}
                        alt="Profile"
                      />
                      <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <FaEdit />
                      </label>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
                    <span className="mt-1 px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-600">
                      <FaEnvelope className="w-5 h-5 mr-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="w-5 h-5 mr-3" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="w-5 h-5 mr-3" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Save Profile Picture"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {user.role === "farmer" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaShoppingCart className="w-6 h-6 text-green-500 mr-2" />
                        <span className="text-2xl font-bold text-gray-800">{stats.listings}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Active Listings</p>
                    </div>
                  )}
                  {user.role === "buyer" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaShoppingCart className="w-6 h-6 text-green-500 mr-2" />
                        <span className="text-2xl font-bold text-gray-800">{stats.orders}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                    </div>
                  )}
                  {user.role === "driver" && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaTruck className="w-6 h-6 text-green-500 mr-2" />
                        <span className="text-2xl font-bold text-gray-800">{stats.pickups}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Completed Pickups</p>
                    </div>
                  )}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaChartLine className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-2xl font-bold text-gray-800">{stats.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Rating</p>
                  </div>
                </div>
              </div>

              {/* Achievements Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <FaTrophy className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Verified Seller</p>
                      <p className="text-sm text-gray-600">Completed 10 successful transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <FaShieldAlt className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Trusted Member</p>
                      <p className="text-sm text-gray-600">Member for over 1 year</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Right Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Settings Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
                  <button
                    onClick={() => navigate("/profile/update-details")}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>

                {/* 2FA Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaUserShield className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button
                      onClick={toggle2FA}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        is2FAEnabled ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          is2FAEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Role-Specific Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin-dashboard")}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaUserShield className="w-6 h-6 text-green-500 mr-3" />
                      <span className="font-medium">Admin Dashboard</span>
                    </button>
                  )}

                  {user.role === "farmer" && (
                    <button
                      onClick={() => navigate("/farmer-listings")}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaShoppingCart className="w-6 h-6 text-green-500 mr-3" />
                      <span className="font-medium">My Listings</span>
                    </button>
                  )}

                  {user.role === "buyer" && (
                    <button
                      onClick={() => navigate("/order-history")}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaShoppingCart className="w-6 h-6 text-green-500 mr-3" />
                      <span className="font-medium">My Orders</span>
                    </button>
                  )}

                  {user.role === "driver" && (
                    <button
                      onClick={() => navigate("")}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaTruck className="w-6 h-6 text-green-500 mr-3" />
                      <span className="font-medium">My Pickups</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Preferences Card 
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaBell className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Notifications</h4>
                        <p className="text-sm text-gray-600">Manage your notification preferences</p>
                      </div>
                    </div>
                    <button className="text-green-500 hover:text-green-600">Manage</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaLanguage className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Language</h4>
                        <p className="text-sm text-gray-600">Select your preferred language</p>
                      </div>
                    </div>
                    <button className="text-green-500 hover:text-green-600">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaPalette className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Theme</h4>
                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                      </div>
                    </div>
                    <button className="text-green-500 hover:text-green-600">Change</button>
                  </div>
                </div>
              </div> */}

              {/* Security Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaLock className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </div>
                    <button 
                    className="text-green-500 hover:text-green-600"
                    onClick={() => navigate("/forgot-password")}>
                      Change
                      </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaHistory className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-800">Login History</h4>
                        <p className="text-sm text-gray-600">View your recent login activity</p>
                      </div>
                    </div>
                    <button className="text-green-500 hover:text-green-600">View</button>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaUserShield className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Security settings updated</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Card 
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaClock className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">New listing created</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaShoppingCart className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Order completed</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FaUserShield className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Security settings updated</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};