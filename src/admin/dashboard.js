import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiUsers, FiBookOpen, FiDollarSign, 
  FiTrendingUp, FiRefreshCw, FiCalendar, FiActivity,
  FiArrowUp, FiArrowDown, FiEye, FiBarChart3
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
            const postURL = serverURL + `/api/dashboard`;
            const response = await axios.post(postURL);
      setData(response.data);
      
      // Store admin policies in session storage
      sessionStorage.setItem('terms', response.data.admin.terms);
      sessionStorage.setItem('privacy', response.data.admin.privacy);
      sessionStorage.setItem('cancel', response.data.admin.cancel);
      sessionStorage.setItem('refund', response.data.admin.refund);
      sessionStorage.setItem('billing', response.data.admin.billing);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: data.users || 0,
      icon: <FiUsers className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Courses',
      value: data.courses || 0,
      icon: <FiBookOpen className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Monthly Revenue',
      value: `$${data.sum || 0}`,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+23%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: `$${data.total || 0}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const StatCard = ({ stat, index }) => (
    <motion.div
      variants={cardVariants}
      className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
          {stat.icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {stat.changeType === 'increase' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
          {stat.change}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {stat.value}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {stat.title}
        </p>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      variants={cardVariants}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      {children}
    </motion.div>
  );

  const UserDistributionChart = () => {
    const paidPercentage = data.users ? Math.round((data.paid / data.users) * 100) : 0;
    const freePercentage = 100 - paidPercentage;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Paid Users</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.paid || 0}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${paidPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Paid: {paidPercentage}%</span>
          <span>Free: {freePercentage}%</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Free Users</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.free || 0}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${freePercentage}%` }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>
      </div>
    );
  };

  const CourseDistributionChart = () => {
    const videoPercentage = data.courses ? Math.round((data.videoType / data.courses) * 100) : 0;
    const textPercentage = 100 - videoPercentage;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Video Courses</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.videoType || 0}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${videoPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Video: {videoPercentage}%</span>
          <span>Text: {textPercentage}%</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Text Courses</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{data.textType || 0}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${textPercentage}%` }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>
      </div>
    );
  };

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
            <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
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
                Admin Dashboard
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {statsCards.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
                                </div>

            {/* Charts */}
            <div className="space-y-6">
              <ChartCard title="User Distribution">
                <UserDistributionChart />
              </ChartCard>
              
              <ChartCard title="Course Distribution">
                <CourseDistributionChart />
              </ChartCard>
                        </div>
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
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back! Here's what's happening with your platform.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar size={16} />
                  {new Date().toLocaleDateString()}
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
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <StatCard key={index} stat={stat} index={index} />
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="User Distribution">
                  <UserDistributionChart />
                </ChartCard>
                
                <ChartCard title="Course Distribution">
                  <CourseDistributionChart />
                </ChartCard>
              </div>

              {/* Additional Metrics */}
              <motion.div
                variants={cardVariants}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {data.users ? Math.round((data.paid / data.users) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${data.sum ? Math.round(data.sum / (data.paid || 1)) : 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Revenue per User</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {data.courses ? Math.round(data.courses / (data.users || 1) * 100) / 100 : 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Courses per User</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
                    </div>
                </div>
            </div>
    );
};

export default Dashboard;
