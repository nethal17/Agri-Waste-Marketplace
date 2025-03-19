import { Navbar } from "@/components/Navbar";
import profilePic from "@/assets/profile.jpg"; // Replace with actual profile image

export const Profile = () => {

    return (
      <>
        <Navbar />
        <div className="grid gap-8 p-4 lg:grid-cols-2 md:px-24 sm:py-8">
          <div className="flex flex-col justify-center items-center lg:py-24 py-10 gap-5 md:m-20 m-5 rounded-lg bg-white p-6 shadow-2xl">
            <div>
              <img
                className="object-cover w-48 h-48 border-4 border-green-600 rounded-full shadow-lg"
                src={profilePic}
                alt=""
              />
            </div>
            <div className="pt-3 mx-6 text-center">
              <h1 className="text-lg font-bold">Available Points</h1>
              <h3 className="text-xl font-bold text-green-600">1500</h3>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold">Account Status</h1>
              <h3 className="text-xl font-bold text-green-600">Blue</h3>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-5 p-6 bg-white rounded-lg">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <h3 className="text-xl font-bold text-green-600">Role</h3>
            <div className="grid grid-cols-1 gap-10 mt-8 xl:grid-cols-2">
              <div className="">
                <h1 className="text-lg font-bold">Name:</h1>
                <p className="text-xl">name</p>
                <h1 className="mt-4 text-lg font-bold">Email:</h1>
                <p className="text-xl">email</p>
                <h1 className="mt-4 text-lg font-bold">Mobile:</h1>
                <p className="text-xl">mobile</p>
              </div>
              <div>
                <h1 className="text-lg font-bold">Country:</h1>
                <p className="text-xl">country</p>
                <h1 className="mt-4 text-lg font-bold">Created at:</h1>
                <p className="text-xl">creatednew</p>
                <h1 className="mt-4 text-lg font-bold">Updated at:</h1>
                <p className="text-xl">updatednew</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 md:flex-row mt-14">
              <button
                className="cursor-pointer px-6 py-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800"
                //onClick={}
              >
                Update Profile
              </button>
                <>
                    <button className="cursor-pointer p-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-800">
                      Pending Activities
                    </button>
                </>
            </div>
          </div>
        </div>
      </>
    );
  };
  