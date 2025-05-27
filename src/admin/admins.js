import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiUsers, FiShield, FiUserPlus, FiUserMinus,
  FiSearch, FiFilter, FiRefreshCw, FiStar, FiUser,
  FiMoreVertical, FiSettings, FiAlertTriangle
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admins = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [admins, setAdmin] = useState([]);
    const [users, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
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

    const cardVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    useEffect(() => {
        sessionStorage.setItem('darkMode', false);
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setIsLoading(true);
            const postURL = serverURL + `/api/getadmins`;
            const response = await axios.get(postURL);
            setAdmin(response.data.admins);
            setUser(response.data.users);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAdminData();
        setTimeout(() => setRefreshing(false), 1000);
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
        setTimeout(() => window.location.reload(), 1500);
    };

    const removeAdmin = async (email) => {
        try {
            const postURL = serverURL + '/api/removeadmin';
            const response = await axios.post(postURL, { email });
            if (response.data.success) {
                showToast(response.data.message, 'success');
            }
        } catch (error) {
            showToast('Failed to remove admin', 'error');
        }
    };

    const addAdmin = async (email) => {
        try {
            const postURL = serverURL + '/api/addadmin';
            const response = await axios.post(postURL, { email });
            if (response.data.success) {
                showToast(response.data.message, 'success');
            }
        } catch (error) {
            showToast('Failed to add admin', 'error');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.mName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const AdminCard = ({ user, isAdmin = false }) => (
        <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                        isAdmin 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}>
                        {isAdmin ? <FiShield className="w-6 h-6" /> : <FiUser className="w-6 h-6" />}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{user.mName}</h3>
                            {isAdmin && user.type === 'yes' && (
                                <FiStar className="w-4 h-4 text-yellow-500" title="Main Admin" />
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isAdmin 
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                                {isAdmin ? (user.type === 'yes' ? 'Main Admin' : 'Admin') : 'User'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    {isAdmin ? (
                        user.type === 'no' ? (
                            <motion.button
                                onClick={() => removeAdmin(user.email)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiUserMinus className="w-4 h-4" />
                                <span className="text-sm font-medium">Remove Admin</span>
                            </motion.button>
                        ) : (
                            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                <FiStar className="w-4 h-4" />
                                <span className="text-sm font-medium">Main Admin</span>
                            </div>
                        )
                    ) : (
                        <motion.button
                            onClick={() => addAdmin(user.email)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiUserPlus className="w-4 h-4" />
                            <span className="text-sm font-medium">Make Admin</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const AdminTableRow = ({ user, isAdmin = false }) => (
        <motion.tr
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        isAdmin 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}>
                        {isAdmin ? <FiShield className="w-5 h-5" /> : <FiUser className="w-5 h-5" />}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <div className="font-medium text-gray-900 dark:text-white">{user.mName}</div>
                            {isAdmin && user.type === 'yes' && (
                                <FiStar className="w-4 h-4 text-yellow-500" title="Main Admin" />
                            )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAdmin 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                    {isAdmin ? (user.type === 'yes' ? 'Main Admin' : 'Admin') : 'User'}
                </span>
            </td>
            <td className="px-6 py-4">
                {isAdmin ? (
                    user.type === 'no' ? (
                        <motion.button
                            onClick={() => removeAdmin(user.email)}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiUserMinus className="w-4 h-4" />
                            <span>Remove Admin</span>
                        </motion.button>
                    ) : (
                        <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                            <FiStar className="w-4 h-4" />
                            <span>Main Admin</span>
                        </div>
                    )
                ) : (
                    <motion.button
                        onClick={() => addAdmin(user.email)}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiUserPlus className="w-4 h-4" />
                        <span>Make Admin</span>
                    </motion.button>
                )}
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
                            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-300">Loading admin data...</p>
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
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                Admin Management
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
                        {/* Search Bar */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search admins and users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </motion.div>

                        {/* Important Note */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <FiAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200">Important Note</h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Making a user admin will also make them a paid user with full access to the platform.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Current Admins */}
                        {filteredAdmins.length > 0 && (
                            <motion.div variants={itemVariants} className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FiShield className="w-5 h-5 mr-2 text-purple-600" />
                                    Current Admins ({filteredAdmins.length})
                                </h2>
                                <div className="space-y-4">
                                    {filteredAdmins.map((admin) => (
                                        <AdminCard key={admin._id} user={admin} isAdmin={true} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Regular Users */}
                        {filteredUsers.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
                                    Regular Users ({filteredUsers.length})
                                </h2>
                                <div className="space-y-4">
                                    {filteredUsers.map((user) => (
                                        <AdminCard key={user._id} user={user} isAdmin={false} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {filteredAdmins.length === 0 && filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No users found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Try adjusting your search criteria
                                </p>
                        </div>
                        )}
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
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                    Admin Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage admin privileges and user roles
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiShield size={16} />
                                    {admins.length} admins
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiUsers size={16} />
                                    {users.length} users
                                </div>
                                <motion.button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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
                            {/* Search Bar */}
                            <motion.div variants={itemVariants}>
                                <div className="relative max-w-md">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search admins and users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </motion.div>

                            {/* Important Note */}
                            <motion.div variants={itemVariants}>
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <FiAlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <div>
                                            <h3 className="font-medium text-amber-800 dark:text-amber-200">Important Note</h3>
                                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                                Making a user admin will also make them a paid user with full access to the platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Admin and User Table */}
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
                                                    Role
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
                                            {filteredAdmins.map((admin) => (
                                                <AdminTableRow key={admin._id} user={admin} isAdmin={true} />
                                            ))}
                                            {filteredUsers.map((user) => (
                                                <AdminTableRow key={user._id} user={user} isAdmin={false} />
                                            ))}
                                            {filteredAdmins.length === 0 && filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-12">
                                                        <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                            No users found
                                                        </h3>
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            Try adjusting your search criteria
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </motion.tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admins;