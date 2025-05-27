import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import slide from '../res/img/about.svg';
import { useNavigate } from 'react-router-dom';
import { company, name } from '../constants';
import { FiArrowRight, FiUsers, FiTarget, FiStar } from 'react-icons/fi';

const About = () => {
    const navigate = useNavigate();

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
            transition: { duration: 0.6 }
        }
    };

    const redirectContact = () => {
        navigate("/contact");
    };

    return (
        <div className='min-h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            
            <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
                {/* Hero Section */}
                <section className='relative overflow-hidden'>
                    <motion.div 
                        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6"
                            variants={itemVariants}
                        >
                            About Us
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg md:text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12"
                            variants={itemVariants}
                        >
                        Welcome to {name}, the cutting-edge AI Course generator brought to you by {company}!
                        </motion.p>
                        
                        {/* Decorative elements */}
                        <motion.div 
                            className="absolute top-10 right-10 w-32 h-32 rounded-full bg-blue-400/10 dark:bg-blue-500/10"
                            animate={{ 
                                y: [0, -20, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 7 }}
                        />
                        
                        <motion.div 
                            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-purple-400/10 dark:bg-purple-500/10"
                            animate={{ 
                                y: [0, 20, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 8, delay: 1 }}
                        />
                    </motion.div>
                </section>
                
                {/* Company Introduction */}
                <section className="py-12 md:py-24 bg-white/60 dark:bg-gray-800/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="flex flex-col md:flex-row items-center gap-12"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <div className="md:w-1/2 order-2 md:order-1">
                                <motion.h2 
                                    className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    Who We Are
                                </motion.h2>
                                
                                <motion.p 
                                    className="text-gray-700 dark:text-gray-300 text-lg mb-6"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                At {company}, we believe in the transformative power of education and the endless possibilities that Artificial Intelligence unlocks.
                                That's why we've developed {name}, a revolutionary SaaS product designed to make course creation seamless, efficient, and intelligent.
                                </motion.p>
                                
                                <motion.div 
                                    className="hidden md:flex items-center mt-8"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.button
                                        onClick={redirectContact}
                                        className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get in Touch <FiArrowRight />
                                    </motion.button>
                                </motion.div>
                        </div>
                            
                            <motion.div 
                                className="md:w-1/2 order-1 md:order-2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.7 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-lg transform rotate-3"></div>
                            <img
                                src={slide}
                                        alt="About Us"
                                        className="relative z-10 w-full h-auto rounded-lg shadow-xl"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
                
                {/* Mission Section */}
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
                                className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Our Mission
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
                            {[
                                {
                                    icon: <FiUsers className="w-6 h-6" />,
                                    title: "Empowering Educators",
                                    description: "We're committed to empowering educators, professionals, and organizations to create exceptional learning experiences effortlessly."
                                },
                                {
                                    icon: <FiTarget className="w-6 h-6" />,
                                    title: "Innovative Technology",
                                    description: `${company} has been on a journey to redefine the intersection of education and technology with passion for innovation.`
                                },
                                {
                                    icon: <FiStar className="w-6 h-6" />,
                                    title: "Quality Excellence",
                                    description: `At ${company}, quality is non-negotiable. ${name} incorporates the latest advancements in AI technology.`
                                }
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full flex items-center justify-center mb-6">
                                        <div className="text-blue-600 dark:text-blue-400">
                                            {item.icon}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div 
                            className="mt-12 text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <p className="text-lg">
                                Empowering educators, professionals, and organizations to create exceptional learning experiences effortlessly is at the heart of what we do. {name} embodies our commitment to leveraging AI technology to simplify the course development process and unlock new realms of educational excellence.
                            </p>
                        </motion.div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
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
                            Join Us on the Learning Journey
                        </motion.h2>
                        
                        <motion.p 
                            className="text-lg text-gray-700 dark:text-gray-300 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                        Embark on a journey of innovation and educational excellence with {name}. Whether you're an educator, a professional, or an organization looking to elevate your learning programs, {company} is here to support you every step of the way.
                        </motion.p>
                        
                        <motion.button
                            onClick={redirectContact}
                            className="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Contact Us <FiArrowRight />
                        </motion.button>
                    </motion.div>
                </section>
            </main>
            
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default About;
