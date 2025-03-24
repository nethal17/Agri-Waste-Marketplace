import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:3000/api/auth/getAllUsers`)
            .then((response) => {
                setAllUsers(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleUserDelete = async (userId) => {
        setLoading(true);

        try {
            await axios.delete(`http://localhost:3000/api/auth/userDelete/${userId}`);

            // Remove deleted user from UI
            setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
            toast.success("Successfully deactivated user account");
            
        } catch (error) {
            toast.error("Failed to deactivate user account");
            console.error("Error deleting user:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p className="text-lg font-semibold text-center">Loading users...</p>
            ) : (
                <div className="w-full h-full p-6">
                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="border rounded-md border-slate-600">No</th>
                                <th className="border rounded-md border-slate-600">Name</th>
                                <th className="border rounded-md border-slate-600 max-md:hidden">Email</th>
                                <th className="border rounded-md border-slate-600 max-md:hidden">Mobile</th>
                                <th className="border rounded-md border-slate-600">Operations</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allUsers.map((user, index) => (
                                <tr key={user._id} className="h-8">
                                    <td className="text-center border rounded-md border-slate-700">
                                        {index + 1}
                                    </td>
                                    <td className="text-center border rounded-md border-slate-700">
                                        {user.name}
                                    </td>
                                    <td className="text-center border rounded-md border-slate-700 max-md:hidden">
                                        {user.email}
                                    </td>
                                    <td className="text-center border rounded-md border-slate-700 max-md:hidden">
                                        {user.phone}
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleUserDelete(user._id)}
                                            className="w-full h-auto text-center text-white bg-red-600 border rounded-md cursor-pointer"
                                        >
                                            Deactivate
                                        </button>
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
