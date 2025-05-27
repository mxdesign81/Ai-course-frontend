import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { serverURL } from '../constants';
import { useNavigate } from 'react-router-dom';
import found from '../res/img/found.svg';
import { FiArrowRight, FiAward, FiClock, FiCalendar, FiVideo, FiImage, FiPlus } from 'react-icons/fi';

const UserCourses = ({ userId }) => {
    const [courses, setCourses] = useState([]);
    const [processing, setProcessing] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchUserCourses = useCallback(async () => {
        setProcessing(page === 1);
        setLoadingMore(page > 1);
        const postURL = `${serverURL}/api/courses?userId=${userId}&page=${page}&limit=9`;
        try {
            const response = await axios.get(postURL);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setCourses((prevCourses) => [...prevCourses, ...response.data]);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setProcessing(false);
            setLoadingMore(false);
        }
    }, [userId, page]);

    useEffect(() => {
        fetchUserCourses();
    }, [fetchUserCourses]);

    const handleScroll = useCallback(() => {
        if (!hasMore || loadingMore) return;
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const navigate = useNavigate();
    const redirectGenerate = () => navigate("/create");

    const handleCourse = async (content, mainTopic, type, courseId, completed, end) => {
        try {
        const postURL = serverURL + '/api/getmyresult';
        const response = await axios.post(postURL, { courseId });
            
            const jsonData = JSON.parse(content);
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('first', completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            
            let ending = '';
            if (completed) ending = end;
            
            navigate('/course', {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: ending,
                    pass: response.data.success ? response.data.message : false,
                    lang: response.data.lang
                }
            });
        } catch (error) {
            console.error("Error handling course:", error);
            const jsonData = JSON.parse(content);
            navigate('/course', {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: completed ? end : '',
                    pass: false,
                    lang: 'en'
                }
            });
        }
    };

    const handleCertificate = (mainTopic, end) => {
        const ending = new Date(end).toLocaleDateString();
        navigate('/certificate', { state: { courseTitle: mainTopic, end: ending } });
    };

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

    // Empty state animations
    const emptyStateVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6 }
        }
    };

    // Loading animation for the dots
    const loadingDotVariants = {
        start: {
            y: 0
        },
        end: {
            y: [0, -10, 0],
            transition: {
                repeat: Infinity,
                duration: 0.6
            }
        }
    };

    return (
        <div>
            {processing ? (
                <motion.div
                    className="flex flex-col items-center justify-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex space-x-2 mb-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400"
                                variants={loadingDotVariants}
                                initial="start"
                                animate="end"
                                transition={{ delay: i * 0.15 }}
                            />
                        ))}
                </div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your courses...</p>
                </motion.div>
            ) : (
                <>
                    {courses.length === 0 ? (
                        <motion.div 
                            className="flex flex-col items-center justify-center py-12 text-center"
                            variants={emptyStateVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-xl transform -translate-y-4"></div>
                                <img alt="No courses found" src={found} className="relative z-10 max-w-xs h-60" />
                        </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Courses Found</h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
                                You haven't created any courses yet. Start your learning journey by creating your first AI-generated course.
                            </p>
                            <motion.button 
                                onClick={redirectGenerate} 
                                className="flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiPlus className="text-lg" />
                                Create Your First Course
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {courses.map((course, index) => (
                                <motion.div 
                                    key={course._id} 
                                    className="w-full"
                                    variants={itemVariants}
                                    layout
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <div className="group h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                                        <div className="relative overflow-hidden">
                                            {/* Course type badge */}
                                            <div className="absolute top-4 left-4 z-10 bg-blue-600/90 dark:bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                {course.type.toLowerCase().includes('video') ? (
                                                    <FiVideo className="text-xs" />
                                                ) : (
                                                    <FiImage className="text-xs" />
                                                )}
                                                <span className="capitalize">{course.type}</span>
                                            </div>
                                            
                                            {/* Completed badge */}
                                            {course.completed && (
                                                <div className="absolute top-4 right-4 z-10 bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <FiAward className="text-xs" />
                                                    Completed
                                                </div>
                                            )}
                                            
                                            {/* Course image with overlay */}
                                            <div className="relative h-48 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/10 z-10"></div>
                                                <img 
                                                    src={course.photo} 
                                                    alt={course.mainTopic}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                                />
                                                
                                                {/* Course title on the image */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                                    <h3 className="text-xl font-bold text-white line-clamp-2">
                                            {course.mainTopic.toUpperCase()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 p-5 flex flex-col">
                                            {/* Course metadata */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar className="text-blue-600 dark:text-blue-400" />
                                                    <span>{new Date(course.date).toLocaleDateString()}</span>
                                                </div>
                                                {course.completed && (
                                                    <div className="flex items-center gap-1">
                                                        <FiClock className="text-blue-600 dark:text-blue-400" />
                                                        <span>Completed: {new Date(course.end).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                                <motion.button 
                                                    onClick={() => handleCourse(course.content, course.mainTopic, course.type, course._id, course.completed, course.end)} 
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                Continue
                                                    <FiArrowRight />
                                                </motion.button>
                                                
                                                {course.completed && (
                                                    <motion.button 
                                                        onClick={() => handleCertificate(course.mainTopic, course.end)} 
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <FiAward />
                                                    Certificate
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>
                                </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                    
                    {loadingMore && (
                        <motion.div 
                            className="flex justify-center my-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex space-x-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"
                                        variants={loadingDotVariants}
                                        initial="start"
                                        animate="end"
                                        transition={{ delay: i * 0.15 }}
                                    />
                                ))}
                        </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserCourses;
