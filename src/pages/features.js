import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import { IoIosTimer } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import { PiVideo } from "react-icons/pi";
import { FiLayers, FiSettings, FiCpu, FiBookOpen, FiMessageSquare, FiDownload, FiArrowRight } from "react-icons/fi";

const Features = () => {
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

    const cardsFeatures = [
        {
            id: 1,
            title: 'Topic Input',
            description: 'Easily enter topics and subtopics with an intuitive interface',
            icon: <FiLayers className="w-6 h-6" />
        },
        {
            id: 2,
            title: 'Course Type Preferences',
            description: 'Choose between Image + Theory or Video + Theory formats for a personalized learning journey',
            icon: <FiSettings className="w-6 h-6" />
        },
        {
            id: 3,
            title: 'AI-Powered Generation',
            description: 'Our advanced AI algorithms analyze your inputs to generate comprehensive courses',
            icon: <FiCpu className="w-6 h-6" />
        },
        {
            id: 4,
            title: 'Learning Styles',
            description: 'Accommodate different learning styles to focus on images, videos, or textual content',
            icon: <FiBookOpen className="w-6 h-6" />
        },
        {
            id: 5,
            title: 'Personalized Curriculum',
            description: 'Receive a uniquely crafted curriculum based on your preferences',
            icon: <BsSearch className="w-6 h-6" />
        },
        {
            id: 6,
            title: 'Real-time Preview',
            description: 'See a real-time preview of your generated course before finalizing',
            icon: <PiVideo className="w-6 h-6" />
        },
        {
            id: 7,
            title: 'Multilanguage Courses',
            description: 'Generate AI images, videos, or textual courses in 23+ multiple languages',
            icon: <FiMessageSquare className="w-6 h-6" />
        },
        {
            id: 8,
            title: 'AI Teacher Chat',
            description: 'Chat with AI teacher to get answers to your questions while learning',
            icon: <FiMessageSquare className="w-6 h-6" />
        },
        {
            id: 9,
            title: 'Export Course',
            description: 'Download your generated course in various formats for offline access',
            icon: <FiDownload className="w-6 h-6" />
        },
    ];

    const cardsWork = [
        {
            id: 1,
            title: 'Enter Topics',
            description: 'Begin the course creation journey by entering your desired topics and a list of subtopics',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 2,
            title: 'Choose Preferences',
            description: 'Choose between Image + Theory or Video + Theory formats for a personalized learning journey',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 3,
            title: 'AI Magic',
            description: 'Watch as our AI processes your inputs to generate a customized course',
            color: 'from-pink-500 to-purple-600'
        }
    ];

    const cardBenefit = [
        {
            id: 1,
            title: 'Time Efficiency',
            description: 'Save hours of manual planning with instant course generation',
            icon: <IoIosTimer className="w-6 h-6" />
        },
        {
            id: 2,
            title: 'AI-Enhanced Materials',
            description: 'Ensure high-quality content with AI-driven recommendations',
            icon: <BsSearch className="w-6 h-6" />
        },
        {
            id: 3,
            title: 'Interactive Learning',
            description: 'Keeping users engaged with different of media formats',
            icon: <PiVideo className="w-6 h-6" />
        }
    ];

    return (
        <div className='min-h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            
            <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
                {/* Hero Section */}
                <section className='relative overflow-hidden'>
                    <motion.div 
                        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10'
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6"
                            variants={itemVariants}
                        >
                            Features
                        </motion.h1>
                        
                        <motion.p 
                            className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12"
                            variants={itemVariants}
                        >
                            Craft your courses Instantly with our powerful AI-driven platform
                        </motion.p>
                        
                        {/* Decorative elements */}
                        <motion.div 
                            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-blue-400/10 dark:bg-blue-500/10"
                            animate={{ 
                                y: [0, -30, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 8 }}
                        />
                        
                        <motion.div 
                            className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-purple-400/10 dark:bg-purple-500/10"
                            animate={{ 
                                y: [0, 30, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 7, delay: 1 }}
                        />
                    </motion.div>
                </section>
                
                {/* Features Grid */}
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2 
                                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Key Features
                            </motion.h2>
                            
                            <motion.div 
                                className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
                                initial={{ width: 0 }}
                                whileInView={{ width: 80 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cardsFeatures.map((feature, index) => (
                                <motion.div 
                                    key={feature.id}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (index * 0.05), duration: 0.5 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full flex items-center justify-center mb-4">
                                        <div className="text-blue-600 dark:text-blue-400">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2 
                                className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Benefits
                            </motion.h2>
                            
                            <motion.div 
                                className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
                                initial={{ width: 0 }}
                                whileInView={{ width: 80 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {cardBenefit.map((benefit, index) => (
                                <motion.div 
                                    key={benefit.id}
                                    className="relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full transform translate-x-10 -translate-y-10"></div>
                                    
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full flex items-center justify-center mb-6">
                                        <div className="text-blue-600 dark:text-blue-400">
                                            {benefit.icon}
                    </div>
                </div>
                                    
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                        {benefit.title}
                                    </h3>
                                    
                                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* How It Works */}
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <motion.h2 
                                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                How It Works
                            </motion.h2>
                            
                            <motion.div 
                                className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"
                                initial={{ width: 0 }}
                                whileInView={{ width: 80 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            {cardsWork.map((step, index) => (
                                <motion.div 
                                    key={step.id}
                                    className="relative flex-1"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <div className="relative z-10 h-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg mb-6">
                                            {step.id}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {step.description}
                                        </p>
                                    </div>
                                    
                                    {/* Connection arrow for desktop */}
                                    {index < cardsWork.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                            <FiArrowRight className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                                    )}
                                </motion.div>
                        ))}
                    </div>
                </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                    <motion.div 
                        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.h2 
                            className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Ready to Start Creating?
                        </motion.h2>
                        
                        <motion.p 
                            className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Experience the power of AI-driven course creation and transform your learning materials today.
                        </motion.p>
                        
                        <motion.button
                            className="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Get Started <FiArrowRight />
                        </motion.button>
                    </motion.div>
                </section>
            </main>
            
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Features;
