import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiCreditCard, FiSearch, FiFilter, FiRefreshCw,
  FiDollarSign, FiCalendar, FiUser, FiTrendingUp, FiTrendingDown,
  FiMoreVertical, FiEye, FiMail, FiClock, FiCheckCircle,
  FiAlertCircle, FiBarChart, FiPieChart, FiActivity
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaidUsers = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showActions, setShowActions] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalSubscribers: 0,
    monthlySubscribers: 0,
    yearlySubscribers: 0,
    churnRate: 0,
    avgRevenuePerUser: 0
  });

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
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    filterSubscriptions();
    calculateAnalytics();
  }, [data, searchTerm, filterType]);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
            const postURL = serverURL + `/api/getpaid`;
            const response = await axios.get(postURL);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscriptionData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterSubscriptions = () => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subscription type
    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.type === filterType);
    }

    setFilteredData(filtered);
  };

  const calculateAnalytics = () => {
    const monthlyUsers = data.filter(user => user.type === 'monthly').length;
    const yearlyUsers = data.filter(user => user.type === 'yearly').length;
    const foreverUsers = data.filter(user => user.type === 'forever').length;
    
    // Mock pricing - you can replace with actual values from constants
    const monthlyPrice = 9.99;
    const yearlyPrice = 99.99;
    
    const monthlyRevenue = monthlyUsers * monthlyPrice;
    const yearlyRevenue = yearlyUsers * yearlyPrice;
    const totalRevenue = monthlyRevenue + yearlyRevenue;
    const totalSubscribers = monthlyUsers + yearlyUsers + foreverUsers;
    const avgRevenuePerUser = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

    setAnalytics({
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalSubscribers,
      monthlySubscribers: monthlyUsers,
      yearlySubscribers: yearlyUsers,
      churnRate: 2.5, // Mock churn rate
      avgRevenuePerUser
    });
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
        case 'view':
          showToast(`View subscription details for ${userEmail}`, 'info');
          break;
        case 'contact':
          showToast(`Contact functionality for ${userEmail}`, 'info');
          break;
        case 'suspend':
          showToast(`Suspend subscription for ${userEmail}`, 'warning');
          break;
        case 'cancel':
          showToast(`Cancel subscription for ${userEmail}`, 'error');
          break;
        default:
          break;
      }
      setShowActions(null);
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const getSubscriptionTypeIcon = (type) => {
    switch (type) {
      case 'monthly':
        return <FiCalendar className="w-4 h-4 text-blue-500" />;
      case 'yearly':
        return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case 'forever':
        return <FiCheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <FiUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSubscriptionTypeBadge = (type) => {
    switch (type) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'yearly':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'forever':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const AnalyticsCard = ({ title, value, icon, trend, color = "blue" }) => (
    <motion.div
      variants={cardVariants}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
            {typeof value === 'number' && title.includes('Revenue') ? formatCurrency(value) : value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <FiTrendingUp className="w-4 h-4 mr-1" /> : <FiTrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const SubscriptionCard = ({ user, index }) => (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {user.mName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{user.mName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
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
                    onClick={() => handleUserAction('view', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('contact', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Contact User</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('suspend', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Suspend</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('cancel', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel Subscription</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {getSubscriptionTypeIcon(user.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionTypeBadge(user.type)}`}>
            {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
            <FiCheckCircle className="w-3 h-3" />
            Active
          </span>
        </div>
      </div>
    </motion.div>
  );

  const SubscriptionTableRow = ({ user, index }) => (
    <motion.tr
      variants={itemVariants}
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
          {getSubscriptionTypeIcon(user.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionTypeBadge(user.type)}`}>
            {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
          <FiCheckCircle className="w-3 h-3" />
          Active
        </span>
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
                    onClick={() => handleUserAction('view', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('contact', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Contact User</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('suspend', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Suspend</span>
                  </button>
                  <button
                    onClick={() => handleUserAction('cancel', user._id, user.email)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel Subscription</span>
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
            <p className="text-gray-600 dark:text-gray-300">Loading subscription data...</p>
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
                Subscriptions & Billing
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
            {/* Analytics Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
              <AnalyticsCard
                title="Total Revenue"
                value={analytics.totalRevenue}
                icon={<FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />}
                trend={12.5}
                color="green"
              />
              <AnalyticsCard
                title="Subscribers"
                value={analytics.totalSubscribers}
                icon={<FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                trend={8.2}
                color="blue"
              />
            </motion.div>

            {/* Search and Filter */}
            <motion.div variants={itemVariants} className="space-y-4 mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
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
                <option value="all">All Subscriptions</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="forever">Forever</option>
              </select>
            </motion.div>

            {/* Subscription Cards */}
            <motion.div variants={itemVariants} className="space-y-4">
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No subscriptions found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                        </div>
              ) : (
                filteredData.map((user, index) => (
                  <SubscriptionCard key={user._id} user={user} index={index} />
                ))
              )}
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
                  Subscriptions & Billing Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Monitor subscription analytics and manage billing
                </p>
                    </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiCreditCard size={16} />
                  {filteredData.length} of {data.length} subscribers
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
              {/* Analytics Dashboard */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Total Revenue"
                  value={analytics.totalRevenue}
                  icon={<FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />}
                  trend={12.5}
                  color="green"
                />
                <AnalyticsCard
                  title="Total Subscribers"
                  value={analytics.totalSubscribers}
                  icon={<FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                  trend={8.2}
                  color="blue"
                />
                <AnalyticsCard
                  title="Monthly Revenue"
                  value={analytics.monthlyRevenue}
                  icon={<FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  trend={15.3}
                  color="purple"
                />
                <AnalyticsCard
                  title="Avg Revenue/User"
                  value={analytics.avgRevenuePerUser}
                  icon={<FiBarChart className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                  trend={-2.1}
                  color="orange"
                />
              </motion.div>

              {/* Search and Filter Bar */}
              <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers by name or email..."
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
                    <option value="all">All Subscriptions</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
              </motion.div>

              {/* Subscriptions Table */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Subscriber
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Payment
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
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              No subscriptions found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                              Try adjusting your search or filter criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((user, index) => (
                          <SubscriptionTableRow key={user._id} user={user} index={index} />
                        ))
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

export default PaidUsers;
