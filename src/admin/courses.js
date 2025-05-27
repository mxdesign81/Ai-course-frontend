import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiBookOpen, FiSearch, FiFilter, FiRefreshCw,
  FiEdit3, FiTrash2, FiEye, FiFlag, FiCalendar, FiUser,
  FiMoreVertical, FiVideo, FiImage, FiClock, FiCheckCircle,
  FiAlertCircle, FiDownload, FiShare2
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Courses = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActions, setShowActions] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

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
    fetchCoursesData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [data, searchTerm, filterType, filterStatus]);

  const fetchCoursesData = async () => {
    try {
      setIsLoading(true);
            const postURL = serverURL + `/api/getcourses`;
            const response = await axios.get(postURL);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCoursesData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filterCourses = () => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.mainTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(course => course.type === filterType);
    }

    // Filter by status (completed/ongoing)
    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => 
        filterStatus === 'completed' ? course.completed : !course.completed
      );
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

  const handleCourseAction = async (action, courseId, courseTitle) => {
    try {
      // Placeholder for course actions - you can implement actual API calls here
      switch (action) {
        case 'view':
          showToast(`View functionality for "${courseTitle}"`, 'info');
          break;
        case 'edit':
          showToast(`Edit functionality for "${courseTitle}"`, 'info');
          break;
        case 'delete':
          showToast(`Delete functionality for "${courseTitle}"`, 'warning');
          break;
        case 'moderate':
          showToast(`Moderate functionality for "${courseTitle}"`, 'warning');
          break;
        case 'approve':
          showToast(`Approve functionality for "${courseTitle}"`, 'success');
          break;
        case 'reject':
          showToast(`Reject functionality for "${courseTitle}"`, 'error');
          break;
        default:
          break;
      }
      setShowActions(null);
    } catch (error) {
      showToast('Action failed', 'error');
    }
  };

  const getCourseTypeIcon = (type) => {
    if (type.toLowerCase().includes('video')) {
      return <FiVideo className="w-4 h-4 text-blue-500" />;
    } else {
      return <FiImage className="w-4 h-4 text-green-500" />;
    }
  };

  const getCourseTypeBadge = (type) => {
    if (type.toLowerCase().includes('video')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  const CourseCard = ({ course, index }) => (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      whileHover={{ y: -5 }}
    >
      {/* Course Header */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
        <img 
          src={course.photo || '/api/placeholder/400/200'} 
          alt={course.mainTopic}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeBadge(course.type)}`}>
            {getCourseTypeIcon(course.type)}
            <span className="capitalize">{course.type}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20">
          {course.completed ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-600/90 text-white rounded-full text-xs font-medium">
              <FiCheckCircle className="w-3 h-3" />
              Completed
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-600/90 text-white rounded-full text-xs font-medium">
              <FiClock className="w-3 h-3" />
              Ongoing
            </div>
          )}
        </div>

        {/* Course Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-lg font-bold text-white line-clamp-2">
            {course.mainTopic}
          </h3>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <FiUser className="w-4 h-4" />
            <span>User: {course.user}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{new Date(course.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handleCourseAction('view', course._id, course.mainTopic)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiEye className="w-3 h-3" />
              View
            </motion.button>
            
            <motion.button
              onClick={() => handleCourseAction('moderate', course._id, course.mainTopic)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFlag className="w-3 h-3" />
              Moderate
            </motion.button>
          </div>

          <div className="relative">
            <motion.button
              onClick={() => setShowActions(showActions === course._id ? null : course._id)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMoreVertical className="w-4 h-4 text-gray-500" />
            </motion.button>
            
            <AnimatePresence>
              {showActions === course._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleCourseAction('edit', course._id, course.mainTopic)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      <span>Edit Course</span>
                    </button>
                    <button
                      onClick={() => handleCourseAction('approve', course._id, course.mainTopic)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-700 dark:text-green-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleCourseAction('reject', course._id, course.mainTopic)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiAlertCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleCourseAction('delete', course._id, course.mainTopic)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete Course</span>
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

  const CourseTableRow = ({ course, index }) => (
    <motion.tr
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={course.photo || '/api/placeholder/60/60'} 
            alt={course.mainTopic}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">
              {course.mainTopic}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {course._id.slice(-8)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          {getCourseTypeIcon(course.type)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeBadge(course.type)}`}>
            {course.type}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {course.user}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(course.date).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        {course.completed ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
            <FiCheckCircle className="w-3 h-3" />
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium">
            <FiClock className="w-3 h-3" />
            Ongoing
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <motion.button
            onClick={() => setShowActions(showActions === course._id ? null : course._id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMoreVertical className="w-4 h-4 text-gray-500" />
          </motion.button>
          
          <AnimatePresence>
            {showActions === course._id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleCourseAction('view', course._id, course.mainTopic)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Course</span>
                  </button>
                  <button
                    onClick={() => handleCourseAction('edit', course._id, course.mainTopic)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    <span>Edit Course</span>
                  </button>
                  <button
                    onClick={() => handleCourseAction('moderate', course._id, course.mainTopic)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-orange-700 dark:text-orange-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiFlag className="w-4 h-4" />
                    <span>Moderate</span>
                  </button>
                  <button
                    onClick={() => handleCourseAction('delete', course._id, course.mainTopic)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete Course</span>
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
            <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>
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
                Course Management
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
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="video & text course">Video Courses</option>
                  <option value="theory & image course">Theory Courses</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <FiBookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">Total Courses</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {data.length}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400">Filtered</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {filteredData.length}
                </div>
                                </div>
            </motion.div>

            {/* Course Cards */}
            <motion.div variants={itemVariants} className="space-y-4">
              {filteredData.length === 0 ? (
                <div className="text-center py-12">
                  <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                        </div>
              ) : (
                filteredData.map((course, index) => (
                  <CourseCard key={course._id} course={course} index={index} />
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
                  Course Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and moderate all platform courses
                </p>
                    </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiBookOpen size={16} />
                  {filteredData.length} of {data.length} courses
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
                    placeholder="Search courses by title or user..."
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
                    <option value="all">All Types</option>
                    <option value="video & text course">Video Courses</option>
                    <option value="theory & image course">Theory Courses</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
              </motion.div>

              {/* View Toggle */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'table' 
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Table
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              {viewMode === 'grid' ? (
                /* Grid View */
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredData.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No courses found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    filteredData.map((course, index) => (
                      <CourseCard key={course._id} course={course} index={index} />
                    ))
                  )}
                </motion.div>
              ) : (
                /* Table View */
                <motion.div
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
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
                            <td colSpan="6" className="text-center py-12">
                              <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No courses found
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter criteria
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((course, index) => (
                            <CourseTableRow key={course._id} course={course} index={index} />
                          ))
                        )}
                      </motion.tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Courses;
