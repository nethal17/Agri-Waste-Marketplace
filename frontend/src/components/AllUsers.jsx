import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  FaUsers, FaUserShield, FaUserCheck, FaUserTimes, 
  FaSearch, FaFilter, FaSort, FaChartBar,
  FaHome, FaUserCog, FaCog, FaSignOutAlt
} from "react-icons/fa";

export const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/auth/getAllUsers`)
      .then((response) => {
        setAllUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUserDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    
    try {
      await axios.delete(`http://localhost:3000/api/auth/userDelete/${selectedUser._id}`);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      toast.success("Successfully deactivated user account");
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Failed to deactivate user account");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "verified" && user.isVerified) ||
                         (filterStatus === "unverified" && !user.isVerified);
    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="/admin-dashboard" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <FaHome className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </a>
            <a href="/all-users" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <FaUsers className="w-5 h-5 mr-3" />
              <span>Users</span>
            </a>
            <a href="/user-management" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <FaUserCog className="w-5 h-5 mr-3" />
              <span>User Management</span>
            </a>
            <a href="/settings" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <FaCog className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </a>
          </nav>
          <div className="p-4 border-t">
            <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-600">Manage and monitor all system users</p>
            </div>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold">{allUsers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Verified Users</p>
                  <p className="text-2xl font-semibold">{allUsers.filter(u => u.isVerified).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaUserTimes className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Unverified Users</p>
                  <p className="text-2xl font-semibold">{allUsers.filter(u => !u.isVerified).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : sortedUsers.length > 0 ? (
                    sortedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={user.profilePic || "https://via.placeholder.com/40"} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaUserShield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-xl font-semibold text-gray-900">Confirm Deactivation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate <span className="font-bold">{selectedUser.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUserDelete}
                disabled={loading}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deactivating..." : "Confirm Deactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
