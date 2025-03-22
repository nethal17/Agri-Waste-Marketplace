import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

export const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]); // Explicitly define the state type
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

    return (
        <div>
            {loading ? (
                <p className="text-center text-lg font-semibold">Loading users...</p>
            ) : (
                <div className="w-full h-full p-6">
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 rounded-md">No</th>
                            <th className="border border-slate-600 rounded-md">Name</th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">Email</th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">Mobile</th>
                            <th className="border border-slate-600 rounded-md">Operations</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allUsers.map((user, index) => (
                            <tr key={user._id} className="h-8">
                                <td className="border border-slate-700 rounded-md text-center">
                                    {index + 1}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center">
                                    {user.name}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {user.email}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {user.phone}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center">
                                    <div className="flex justify-center gap-x-4">
                                        <Link to={`/users/details/${user._id}`}>
                                            <BsInfoCircle className="text-2xl text-green-800"/>
                                        </Link>
                                        <Link to={`/users/delete/${user._id}`}>
                                            <MdOutlineDelete className="text-2xl text-red-600"/>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
};