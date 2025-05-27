import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { serverURL } from '../constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';

const Shareable = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [courseTitle, setCourseTitle] = useState("");
    
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const id = query.get('id');

        if (!id) {
            showToast("Course doesn't exist");
            setError(true);
            setTimeout(() => navigate("/create"), 2000);
        } else {
            getDataFromDatabase(id);
        }
    }, []);

    async function getDataFromDatabase(id) {
        const postURL = serverURL + `/api/shareable?id=${id}`;
        try {
            const response = await axios.get(postURL);
            const dat = response.data[0].content;
            const jsonData = JSON.parse(dat);
            const mainTopic = response.data[0].mainTopic;
            
            setCourseTitle(mainTopic);
            sessionStorage.setItem('courseId', id);
            sessionStorage.setItem('first', response.data[0].completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            
            let type = response.data[0].type.toLowerCase();
            
            setTimeout(() => {
            if (sessionStorage.getItem('uid') === null) {
                sessionStorage.setItem('shared', id);
                    navigate('/course', { 
                        state: { 
                            jsonData: jsonData, 
                            mainTopic: mainTopic.toUpperCase(), 
                            type: type, 
                            courseId: id, 
                            end: '', 
                            pass: false 
                        } 
                    });
            } else {
                    handleLoggedInUser(jsonData, mainTopic, type, id);
                }
            }, 1500); // Short delay for better UX
        } catch (error) {
            showToast("Course doesn't exist");
            setError(true);
            setTimeout(() => navigate("/create"), 2000);
        }
    }
    
    async function handleLoggedInUser(jsonData, mainTopic, type, id) {
        try {
                const user = sessionStorage.getItem('uid');
                const content = JSON.stringify(jsonData);
                const postURLs = serverURL + '/api/courseshared';
                const responses = await axios.post(postURLs, { user, content, type, mainTopic });
            
                if (responses.data.success) {
                    sessionStorage.setItem('courseId', responses.data.courseId);
                    sessionStorage.setItem('first', responses.data.completed);
                    sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
                navigate('/course', { 
                    state: { 
                        jsonData: jsonData, 
                        mainTopic: mainTopic.toUpperCase(), 
                        type: type.toLowerCase(), 
                        courseId: responses.data.courseId, 
                        end: '', 
                        pass: false 
                    } 
                });
                } else {
                    sessionStorage.setItem('shared', id);
                navigate('/course', { 
                    state: { 
                        jsonData: jsonData, 
                        mainTopic: mainTopic.toUpperCase(), 
                        type: type, 
                        courseId: id, 
                        end: '', 
                        pass: false 
                    } 
                });
            }
        } catch (error) {
            showToast("Error processing shared course");
            setTimeout(() => navigate("/create"), 2000);
        }
    }

    const showToast = async (msg) => {
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    };

    // Loading animation variants
    const loadingCircleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const circleVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black p-4">
            <motion.div 
                className="flex flex-col items-center justify-center text-center"
                initial="hidden"
                animate="visible"
                variants={loadingCircleVariants}
            >
                <motion.div
                    className="relative mb-8"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                    <motion.div 
                        className="absolute inset-0 rounded-full bg-blue-500/30 dark:bg-blue-600/30"
                        variants={circleVariants}
                        animate="animate"
                    />
                    <div className="relative z-10 w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-xl">
                        <FiShare2 className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {error ? "Course Not Found" : (courseTitle ? `Loading ${courseTitle}...` : "Loading Shared Course...")}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    {error 
                        ? "The course you're looking for doesn't exist or has been removed." 
                        : "Please wait while we prepare your shared course content. You'll be redirected automatically."}
                </p>
                
                {!error && (
                    <div className="mt-6 flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.2, 
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Shareable;
