import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  FaUsers, FaUserShield, FaUserCheck, FaUserTimes, 
  FaSearch, FaFilter, FaSort, FaChartBar,
  FaHome, FaUserCog, FaCog, FaSignOutAlt,
  FaFileExport, FaFileImport, FaHistory, FaDownload
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  
  return 'just now';
};

export const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [userActivityLogs, setUserActivityLogs] = useState([]);

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
    const matchesRole = filterRole === "all" ||
                          (filterRole === "farmers" && user.role === "farmer") ||
                          (filterRole === "buyers" && user.role === "buyer") ||
                          (filterRole === "drivers" && user.role === "truck_driver");     
    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "lastLogin") {
      const aLastLogin = a.loginHistory && a.loginHistory.length > 0 
        ? new Date(a.loginHistory[a.loginHistory.length - 1].timestamp)
        : new Date(0);
      const bLastLogin = b.loginHistory && b.loginHistory.length > 0 
        ? new Date(b.loginHistory[b.loginHistory.length - 1].timestamp)
        : new Date(0);
      return bLastLogin - aLastLogin;
    }
    return 0;
  });

  const handleExportUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/exportUsers`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'User-Details.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to export users");
      console.error("Error exporting users:", error);
    }
  };

  const handleUserActivityLog = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/userActivity/${userId}`);
      setUserActivityLogs(response.data.data);
      setShowActivityLog(true);
    } catch (error) {
      toast.error("Failed to fetch user activity logs");
      console.error("Error fetching user activity logs:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0 hidden'} fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300`}>
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
      <div className={`flex-1 overflow-auto transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <div className="p-6 bg-white shadow-sm rounded-xl">
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
            <div className="p-6 bg-white shadow-sm rounded-xl">
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
            <div className="p-6 bg-white shadow-sm rounded-xl">
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

          {/* Enhanced Filters and Search */}
          <div className="p-6 mb-8 bg-white shadow-sm rounded-xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="farmers">Farmers</option>
                    <option value="buyers">Buyers</option>
                    <option value="drivers">Drivers</option>
                  </select>
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
                    <option value="lastLogin">Sort by Last Login</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
            </div>
            <button
              onClick={handleExportUsers}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FaFileExport className="mr-2" />
              Export Users
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Logged In</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : sortedUsers.length > 0 ? (
                    sortedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img className="w-10 h-10 rounded-full" src={user.profilePic || "https://via.placeholder.com/40"} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">
                            {user.role === "farmer" ? "Farmer" : user.role === "buyer" ? "Buyer" : "Driver"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {user.loginHistory && user.loginHistory.length > 0 
                            ? formatTimeAgo(user.loginHistory[user.loginHistory.length - 1].timestamp)
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleUserActivityLog(user._id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaHistory className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deactivate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white shadow-xl rounded-xl w-3/4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">User Activity Log</h3>
              <button
                onClick={() => setShowActivityLog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {userActivityLogs.map((log, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white shadow-xl rounded-xl w-96">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaUserShield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="ml-3 text-xl font-semibold text-gray-900">Confirm Deactivation</h3>
            </div>
            <p className="mb-6 text-gray-600">
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
