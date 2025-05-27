import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { serverURL } from '../constants';
import Header from '../components/header';
import Footers from '../components/footers';

// Icons
import { PiKeyboard, PiVideo, PiStudentFill, PiFeatherFill, PiBooks, PiLightbulb } from "react-icons/pi";
import { RiAiGenerate } from "react-icons/ri";
import { HiArrowRight, HiOutlineChevronDown } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { FiMonitor, FiCpu, FiBookOpen, FiLayers, FiGrid } from "react-icons/fi";

const Landing = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    // Intersection observers for animations
    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    const [featuresRef, featuresInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    const [howItWorksRef, howItWorksInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    const [testimonialsRef, testimonialsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    const [ctaRef, ctaInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
                duration: 0.5
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

    // Fetch policies data on component mount
    useEffect(() => {
        async function fetchPolicies() {
            try {
                const response = await axios.get(`${serverURL}/api/policies`);
                if (response.data && response.data[0]) {
            sessionStorage.setItem('TermsPolicy', response.data[0].terms);
                    sessionStorage.setItem('PrivacyPolicy', response.data[0].privacy);
                }
                setIsLoaded(true);
            } catch (error) {
                console.error("Failed to fetch policies:", error);
                setIsLoaded(true);
            }
        }
        
        if (
            sessionStorage.getItem('TermsPolicy') === null && 
            sessionStorage.getItem('PrivacyPolicy') === null
        ) {
            fetchPolicies();
        } else {
            setIsLoaded(true);
        }
    }, []);

    // Navigation functions
    const goToSignIn = () => navigate("/signin");
    const goToSignUp = () => navigate("/signup");
    const goToFeatures = () => navigate("/features");
    const goToPricing = () => navigate("/pricing", { state: { header: false } });

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
            <Header isHome={false} />
            
            {/* Hero Section */}
            <motion.section 
                ref={heroRef}
                className="relative flex flex-col items-center px-4 pt-20 pb-32 md:px-8 lg:px-16 overflow-hidden"
                initial="hidden"
                animate={heroInView && isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div 
                    className="absolute -top-10 -right-10 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-70 z-0"
                    variants={itemVariants}
                />
                <motion.div 
                    className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"
                    variants={itemVariants}
                />
                
                <motion.h1 
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 z-10"
                    variants={itemVariants}
                >
                    AI Course Generator
                </motion.h1>
                
                <motion.p 
                    className="text-center text-gray-700 dark:text-gray-300 max-w-2xl text-lg md:text-xl mb-8 z-10"
                    variants={itemVariants}
                >
                    Create personalized courses tailored to your needs with AI-powered content generation. 
                    Available in 23+ languages with interactive chat, quizzes, and offline access.
                </motion.p>
                
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 mb-12 z-10"
                    variants={itemVariants}
                >
                    <button 
                        onClick={goToSignUp} 
                        className="px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transform hover:scale-105 transition-all"
                    >
                        Get Started Free
                    </button>
                    <button 
                        onClick={goToFeatures} 
                        className="px-8 py-3 text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all flex items-center justify-center"
                    >
                        <span>Explore Features</span>
                        <HiArrowRight className="ml-2" />
                    </button>
                </motion.div>
                
                <motion.div 
                    className="relative w-full max-w-5xl mx-auto z-10"
                    variants={itemVariants}
                >
                    <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl dark:shadow-blue-900/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                        {/* Animated Hero Content */}
                        <div className="flex items-center justify-center w-full h-full p-8">
                            <motion.div 
                                className="relative grid grid-cols-3 gap-4 w-full max-w-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {/* AI Engine Animation */}
                                <motion.div 
                                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center z-20"
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            "0 0 0 0 rgba(59, 130, 246, 0.5)",
                                            "0 0 0 10px rgba(59, 130, 246, 0)",
                                            "0 0 0 0 rgba(59, 130, 246, 0)"
                                        ]
                                    }}
                                    transition={{ 
                                        repeat: Infinity, 
                                        duration: 2
                                    }}
                                >
                                    <FiCpu className="text-white text-xl" />
                                </motion.div>
                                
                                {/* Course Topic Cards */}
                                {[
                                    { icon: <FiBookOpen />, title: "AI Fundamentals", delay: 0 },
                                    { icon: <FiGrid />, title: "Web Development", delay: 0.8 },
                                    { icon: <FiLayers />, title: "Data Science", delay: 0.4 },
                                    { icon: <PiLightbulb />, title: "Digital Marketing", delay: 1.2 },
                                    { icon: <PiBooks />, title: "Machine Learning", delay: 1.6 },
                                    { icon: <FiMonitor />, title: "UX Design", delay: 2.0 }
                                ].map((card, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ 
                                            scale: 1, 
                                            opacity: 1,
                                            y: [0, -5, 0]
                                        }}
                                        transition={{ 
                                            scale: { delay: card.delay, duration: 0.4 },
                                            opacity: { delay: card.delay, duration: 0.4 },
                                            y: { 
                                                delay: card.delay, 
                                                duration: 1.5, 
                                                repeat: Infinity,
                                                repeatType: "reverse" 
                                            }
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="text-blue-600 dark:text-blue-400 mr-2">
                                                {card.icon}
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {card.title}
                                            </h3>
                                        </div>
                                        <div className="mt-2">
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ 
                                                        delay: card.delay + 0.2, 
                                                        duration: 1.5,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {/* Connection Lines */}
                                {[0, 1, 2, 3, 4, 5].map(index => (
                                    <motion.div
                                        key={`line-${index}`}
                                        className="absolute left-1/2 top-1/2 h-px bg-blue-400 dark:bg-blue-600 transform -translate-x-1/2 -translate-y-1/2 origin-left z-10"
                                        style={{ 
                                            rotate: `${index * 60}deg`,
                                            width: '40%'
                                        }}
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{ scaleX: 1, opacity: 0.5 }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                    </div>
                    
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        <motion.div 
                            className="flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            onClick={() => {
                                document.getElementById('features').scrollIntoView({ 
                                    behavior: 'smooth' 
                                });
                            }}
                        >
                            <HiOutlineChevronDown className="text-2xl text-gray-600 dark:text-gray-300" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>
            
            {/* Features Section */}
            <motion.section 
                id="features"
                ref={featuresRef}
                className="py-20 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900"
                initial="hidden"
                animate={featuresInView && isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
                        variants={itemVariants}
                    >
                        Unlock Infinite Knowledge
                    </motion.h2>
                    
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div className="space-y-8" variants={containerVariants}>
                            <motion.div className="flex gap-4" variants={itemVariants}>
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <PiStudentFill className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Study Online</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Engage with interactive video & theory lectures designed to maximize your learning experience.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <motion.div className="flex gap-4" variants={itemVariants}>
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <PiFeatherFill className="text-2xl text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Create Courses</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Build comprehensive courses on any topic with our AI-powered content generation system.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <motion.div className="flex gap-4" variants={itemVariants}>
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                    <RiAiGenerate className="text-2xl text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">AI Generation</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Leverage advanced AI to generate structured, relevant course content in multiple languages.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="relative rounded-2xl overflow-hidden shadow-xl h-80 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
                            variants={itemVariants}
                        >
                            {/* Animated Course Creation Process */}
                            <div className="w-full max-w-md px-4">
                                {/* Topic Input Animation */}
                                <motion.div 
                                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-500 dark:text-gray-300 mr-2">Topic:</span>
                                        <motion.div
                                            animate={{ opacity: [0, 1] }}
                                            transition={{ duration: 0.3, delay: 0.5 }}
                                        >
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">Machine Learning Fundamentals</span>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Processing Animation */}
                                <motion.div 
                                    className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mb-4 overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    <div className="flex items-center justify-center">
                                        <RiAiGenerate className="text-3xl text-purple-600 dark:text-purple-400 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">AI Processing</span>
                                    </div>
                                    
                                    <motion.div 
                                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ 
                                            delay: 0.9, 
                                            duration: 1.5,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </motion.div>

                                {/* Result Animation */}
                                <motion.div 
                                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4"
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 2.5, duration: 0.5 }}
                                >
                                    <div className="mb-2 font-medium text-gray-700 dark:text-white">Generated Course Outline:</div>
                                    
                                    {["Introduction to ML", "Supervised Learning", "Neural Networks"].map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            className="flex items-center my-2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 2.7 + (index * 0.2), duration: 0.3 }}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-300">{item}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>
            
            {/* How It Works Section */}
            <motion.section 
                ref={howItWorksRef}
                className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-black"
                initial="hidden"
                animate={howItWorksInView && isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div className="max-w-6xl mx-auto" variants={containerVariants}>
                    <motion.h2 
                        className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
                        variants={itemVariants}
                    >
                        How It Works
                    </motion.h2>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div 
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <PiKeyboard className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Enter Course Title</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Simply input your desired course topic, and our AI will handle the rest of the content creation process.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center relative"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="absolute -left-4 top-1/2 hidden md:block">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <RiAiGenerate className="text-3xl text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">AI Generates Sub-Topics</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our AI analyzes your topic and automatically generates a comprehensive list of relevant sub-topics.
                            </p>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center relative"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="absolute -left-4 top-1/2 hidden md:block">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                <PiVideo className="text-3xl text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Video & Theory Courses</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Enjoy your personalized course with both video content and detailed theory modules for comprehensive learning.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>
            
            {/* Testimonials/Stats Section */}
            <motion.section 
                ref={testimonialsRef}
                className="py-20 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-900"
                initial="hidden"
                animate={testimonialsInView && isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div className="max-w-6xl mx-auto text-center" variants={containerVariants}>
                    <motion.h2 
                        className="text-4xl font-bold mb-4 text-gray-800 dark:text-white"
                        variants={itemVariants}
                    >
                        Transforming Education
                    </motion.h2>
                    
                    <motion.p 
                        className="text-xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto"
                        variants={itemVariants}
                    >
                        Join thousands of learners who are already creating and consuming AI-generated courses
                    </motion.p>
                    
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">23+</h3>
                            <p className="text-gray-600 dark:text-gray-300">Languages Supported</p>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</h3>
                            <p className="text-gray-600 dark:text-gray-300">AI-Generated Content</p>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <h3 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</h3>
                            <p className="text-gray-600 dark:text-gray-300">Learning Access</p>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">∞</h3>
                            <p className="text-gray-600 dark:text-gray-300">Course Possibilities</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>
            
            {/* CTA Section */}
            <motion.section 
                ref={ctaRef}
                className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900"
                initial="hidden"
                animate={ctaInView && isLoaded ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div className="max-w-4xl mx-auto text-center" variants={containerVariants}>
                    <motion.h2 
                        className="text-4xl font-bold mb-6 text-white"
                        variants={itemVariants}
                    >
                        Ready to Transform Your Learning Experience?
                    </motion.h2>
                    
                    <motion.p 
                        className="text-xl text-white/90 mb-10"
                        variants={itemVariants}
                    >
                        Start creating personalized courses tailored to your needs today.
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={itemVariants}
                    >
                        <button 
                            onClick={goToSignUp} 
                            className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                        >
                            Get Started Free
                        </button>
                        <button 
                            onClick={goToPricing} 
                            className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-bold hover:bg-white/10 transform hover:scale-105 transition-all"
                        >
                            View Pricing
                        </button>
                    </motion.div>
                </motion.div>
            </motion.section>
            
            <Footers />
        </div>
    );
};

export default Landing;