import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

export const AllDrivers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:3000/api/auth/getAllUsers`)
            .then((response) => {
                setAllUsers(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    }, []);

    // Filter users to show only Truck Drivers
    const truck_drivers = allUsers.filter((user) => user.role === "truck_driver");

    return (
        <>
      <div className="max-w-6xl px-8 py-8 mx-auto mt-6 sm:px-6 lg:px-8">
      <h2 className="mb-5 text-3xl font-semibold text-center text-gray-900">All Truck Drivers</h2>
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-green-100 ">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                        Created At
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                        Telephone
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {truck_drivers.length > 0 ? (
                        truck_drivers.map((user) => (
                      <tr key={user._id} className="cursor-pointer hover:bg-green-300">
                        <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="object-cover w-10 h-10 rounded-full"
                                src={user.profilePic}
                                alt="profile picture"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-light text-black">{user.name}</div>
                              <div className="font-semibold text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-md whitespace-nowrap">
                        {new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <span
                            className={`inline-flex px-2 font-bold leading-5 rounded-full text-md ${
                            user.isVerified ? "text-green-700" : "text-red-700"}`}
                        >
                            {user.isVerified ? "Verified" : "Not Verified"}
                        </span>
                        </td>
                        <td className="px-3 py-4 text-black text-md whitespace-nowrap">{user.phone}</td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <button 
                          onClick={() => handleUserDelete(user._id)}
                          className="justify-center w-full h-[35px] text-center text-white bg-red-600 border rounded-md cursor-pointer justify"
                        >
                          Deactivate
                        </button>
                        </td>
                      </tr>
                    )) 
                    ): (
                        <tr>
                            <td colSpan={5} className="p-4 text-center">
                                No truck drivers found.
                            </td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
};