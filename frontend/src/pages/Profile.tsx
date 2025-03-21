import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import axios from "axios";
import { toast } from "sonner"; // Toast notifications
import { Link } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setUser((prevUser: any) => ({ ...prevUser, profilePic: response.data.profilePic }));
      toast.success("Profile picture updated successfully!");
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to upload image.");
      console.error(error);
    } finally {
      setUploading(false);
    }
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
      <div className="grid gap-8 p-4 lg:grid-cols-2 md:px-24 sm:py-8">
        <div className="flex flex-col justify-center items-center lg:py-24 py-10 gap-5 md:m-20 m-5 rounded-lg bg-white p-6 shadow-2xl">
          <div>
            <img
              className="object-cover w-48 h-48 border-4 border-green-600 rounded-full shadow-lg"
              src={imagePreview || user.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
            />
          </div>
          <div className="pt-3 mx-6 text-center">
            <h1 className="text-lg font-bold">Upload a profile photo</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
            
              <button
                onClick={handleUpload}
                className="cursor-pointer px-6 py-2 mt-4 font-bold text-white bg-green-600 rounded-2xl hover:bg-green-800"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold">Account Status</h1>
            <h3 className="text-xl font-bold text-green-600">Blue</h3>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-5 p-6 bg-white rounded-lg">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <h3 className="text-xl font-bold text-green-600">{user.role}</h3>
          <div className="grid grid-cols-1 gap-10 mt-8 xl:grid-cols-2">
            <div>
              <h1 className="text-lg font-bold">Name:</h1>
              <p className="text-xl">{user.name}</p>
              <h1 className="mt-4 text-lg font-bold">Email:</h1>
              <p className="text-xl">{user.email}</p>
              <h1 className="mt-4 text-lg font-bold">Mobile:</h1>
              <p className="text-xl">{user.phone}</p>
            </div>
            <div>
              <h1 className="mt-4 text-lg font-bold">Created at:</h1>
              <p className="text-xl">{new Date(user.createdAt).toLocaleDateString()}</p>
              <h1 className="mt-4 text-lg font-bold">Updated at:</h1>
              <p className="text-xl">{new Date(user.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row mt-14">
            <Link to="update-details">
            <button
              className="cursor-pointer px-6 py-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800"
            >
              Update Profile
            </button>
            </Link>
            {user.role === "admin" && (
            <>
              <button className="cursor-pointer p-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800">
                Admin Dashboard
              </button>
            </>
            )}

            {user.role === "farmer" && (
            <>
              <button className="cursor-pointer p-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800">
                My Listings
              </button>
            </>
            )}

            {user.role === "buyer" && (
            <>
              <button className="cursor-pointer p-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800">
                My Orders
              </button>
            </>
            )}

            {user.role === "driver" && (
            <>
              <button className="cursor-pointer p-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800">
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
