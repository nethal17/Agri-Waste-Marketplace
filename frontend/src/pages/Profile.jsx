import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <>
      <Navbar />
      <br/><br/><br/><br/>
      <div className="grid gap-12 p-4 lg:grid-cols-2 md:px-24 sm:py-8">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-white shadow-lg w-full h-full min-h-[500px] shadow-gray-400">
          <img
            className="object-cover w-48 h-48 border-4 border-green-600 rounded-full shadow-md"
            src={imagePreview || user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <div className="pt-4 text-center">
            <h1 className="text-xl font-bold">Upload a profile photo</h1>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 mt-2 bg-gray-100 border rounded-lg cursor-pointer file:bg-green-600 file:text-white file:py-2 file:px-4 file:border-none file:rounded-lg hover:file:bg-green-700"
            />
            <button
              onClick={handleUpload}
              className="w-full py-2 mt-4 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* 2FA Toggle Button */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-lg font-bold">2-Factor Authentication</span>
            <button
              onClick={toggle2FA}
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${is2FAEnabled ? "bg-green-600" : "bg-gray-400"}`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-md transform duration-300 ${is2FAEnabled ? "translate-x-6" : "translate-x-0"}`}
              ></span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col p-6 rounded-lg bg-white shadow-lg w-full h-full min-h-[500px] shadow-gray-400">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="place-items-center">
          <h3 className="text-2xl font-bold text-green-600">{user.role}</h3>
          <div className="mt-10">
            <p className="text-lg font-bold">Name: <span className="px-5 font-light">{user.name}</span></p>
            <p className="mt-2 text-lg font-bold">Email: <span className="px-5 font-light">{user.email}</span></p>
            <p className="mt-2 text-lg font-bold">Mobile: <span className="px-5 font-light">{user.phone}</span></p>
            <p className="mt-2 text-lg font-bold">Created at: <span className="px-5 font-light">{new Date(user.createdAt).toLocaleDateString()}</span></p>
            <p className="mt-2 text-lg font-bold">Updated at: <span className="px-5 font-light">{new Date(user.updatedAt).toLocaleDateString()}</span></p>
          </div>
          </div>
          <br/>
          <div className="flex justify-center gap-10 mt-12">
            
            <button 
            className="w-full px-4 py-2 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/profile/update-details")} >
              Update Details
            </button>
            
            {user.role === "admin" && (
            <>
            <button 
            className="w-full px-4 py-2 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/admin-dashboard")} >
              Admin Dashboard
            </button>
            </>
            )}

            {user.role === "farmer" && (
            <>
            <button 
            className="w-full px-4 py-2 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/farmer-listings")} >
              My Listings
            </button>
            </>
            )}

            {user.role === "buyer" && (
            <>
            <button 
            className="w-full px-4 py-2 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/order-history")} >
              My Orders
            </button>
            </>
            )}

            {user.role === "driver" && (
            <>
            <button 
            className="w-full px-4 py-2 text-lg text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => navigate("")} >
              My Pickups
            </button>
            </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};