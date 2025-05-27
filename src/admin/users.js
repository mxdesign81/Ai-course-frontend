import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiUsers, FiSearch, FiFilter, FiRefreshCw,
  FiEdit3, FiTrash2, FiUserX, FiUserCheck, FiMail, FiCalendar,
  FiMoreVertical, FiEye, FiShield, FiStar, FiUser
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Users = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showActions, setShowActions] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

    useEffect(() => {
        sessionStorage.setItem('darkMode', false);
    fetchUsersData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [data, searchTerm, filterType]);

  const fetchUsersData = async () => {
    try {
      setIsLoading(true);
            const postURL = serverURL + `/api/getusers`;
            const response = await axios.get(postURL);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsersData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterUsers = () => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.type === filterType);
    }

    setFilteredData(filtered);
  };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  const showToast = (msg, type = 'success') => {
    toast(msg, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type
    });
  };

  const handleUserAction = async (action, userId, userEmail) => {
    try {
      // Placeholder for user actions - you can implement actual API calls here
      switch (action) {
        case 'edit':
          showToast(`Edit functionality for ${userEmail}`, 'info');
          break;
        case 'delete':
          showToast(`Delete functionality for ${userEmail}`, 'warning');
          break;
        case 'suspend':
          showToast(`Suspend functionality for ${userEmail}`, 'warning');
          break;
        case 'activate':
          showToast(`Activate functionality for ${userEmail}`, 'success');
          break;
        default:
          break;
      }
      setShowActions(null);
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'free':
        return <FiUser className="w-4 h-4 text-gray-500" />;
      case 'monthly':
      case 'yearly':
        return <FiStar className="w-4 h-4 text-yellow-500" />;
      case 'forever':
        return <FiShield className="w-4 h-4 text-purple-500" />;
      default:
        return <FiUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUserTypeBadge = (type) => {
    const badges = {
      free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      monthly: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      yearly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      forever: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };

    return badges[type] || badges.free;
  };

  const UserCard = ({ user, index }) => (
    <motion.div
      variants={tableRowVariants}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {user.mName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{user.mName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {getUserTypeIcon(user.type)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeBadge(user.type)}`}>
              {user.type}
            </span>
          </div>
          
          <div className="relative">
            <motion.button
              onClick={() => setShowActions(showActions === user._id ? null : user._id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMoreVertical className="w-4 h-4 text-gray-500" />
            </motion.button>
            
            <AnimatePresence>
              {showActions === user._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleUserAction('edit', user._id, user.email)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      <span>Edit User</span>
                    </button>
                    <button
                      onClick={() => handleUserAction('suspend', user._id, user.email)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUserX className="w-4 h-4" />
                      <span>Suspend User</span>
                    </button>
                    <button
                      onClick={() => handleUserAction('delete', user._id, user.email)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete User</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const UserTableRow = ({ user, index }) => (
    <motion.tr
      variants={tableRowVariants}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.mName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.mName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          {getUserTypeIcon(user.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeBadge(user.type)}`}>
            {user.type}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <motion.button
            onClick={() => setShowActions(showActions === user._id ? null : user._id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMoreVertical className="w-4 h-4 text-gray-500" />
          </motion.button>
          
          <AnimatePresence>
            {showActions === user._id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleUserAction('edit', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    <span>Edit User</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('suspend', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUserX className="w-4 h-4" />
                    <span>Suspend User</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('delete', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete User</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black opacity-50 z-50"
                                            onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>
        
        <div className="flex flex-col">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                User Management
              </h1>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="p-4 pb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Search and Filter */}
            <motion.div variants={itemVariants} className="space-y-4 mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="free">Free Users</option>
                <option value="monthly">Monthly Users</option>
                <option value="yearly">Yearly Users</option>
                <option value="forever">Forever Users</option>
              </select>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">Total Users</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {data.length}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <FiUserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400">Filtered</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {filteredData.length}
                                </div>
                        </div>
            </motion.div>

            {/* User Cards */}
            <motion.div variants={itemVariants} className="space-y-3">
              {filteredData.map((user, index) => (
                <UserCard key={user._id} user={user} index={index} />
              ))}
            </motion.div>
          </motion.div>
          
                        <AdminSidebarMobile isSidebarOpen={isSidebarOpen} />
                    </div>
                </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
                    <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all platform users
                </p>
                    </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiUsers size={16} />
                  {filteredData.length} of {data.length} users
                </div>
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
                </div>
            </div>
          </motion.div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Search and Filter Bar */}
              <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="free">Free Users</option>
                    <option value="monthly">Monthly Users</option>
                    <option value="yearly">Yearly Users</option>
                    <option value="forever">Forever Users</option>
                  </select>
                </div>
              </motion.div>

              {/* Users Table */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      {filteredData.map((user, index) => (
                        <UserTableRow key={user._id} user={user} index={index} />
                      ))}
                    </motion.tbody>
                  </table>
                </div>
                
                {filteredData.length === 0 && (
                  <div className="text-center py-12">
                    <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Users;
