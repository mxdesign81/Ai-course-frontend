import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [msg, setMsg] = useState('');
    const [formFocus, setFormFocus] = useState({
        fname: false,
        lname: false,
        email: false,
        phone: false,
        msg: false
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

    const buttonVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
    };

    const showToast = async (msg) => {
        setProcessing(false);
        setFname('');
        setLname('');
        setEmail('');
        setPhone('');
        setMsg('');
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    async function contactSubmit(e) {
        e.preventDefault();
        if (!email || !phone || !fname || !lname || !msg) {
            showToast('Please fill in all required fields');
            return;
        }
        const postURL = serverURL + '/api/contact';
        try {
            setProcessing(true);
            const response = await axios.post(postURL, { fname, lname, email, phone, msg });
            if (response.data.success) {
                showToast(response.data.message);
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            
            <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <motion.div
                        className="flex flex-col md:flex-row items-stretch gap-12"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Left side - Contact info */}
                        <motion.div 
                            className="md:w-1/3 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
                            variants={itemVariants}
                        >
                            <motion.h1 
                                className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                                variants={itemVariants}
                            >
                                Get In Touch
                            </motion.h1>
                            
                            <motion.p 
                                className="text-gray-700 dark:text-gray-300 mb-8"
                                variants={itemVariants}
                            >
                                We'd love to hear from you. Please fill out the form and we'll get back to you as soon as possible.
                            </motion.p>
                            
                            <div className="space-y-6">
                                <motion.div 
                                    className="flex items-start gap-4"
                                    variants={itemVariants}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <FiMail className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                                        <p className="text-gray-700 dark:text-gray-300">support@aicourse.com</p>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex items-start gap-4"
                                    variants={itemVariants}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                                        <p className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</p>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                                variants={itemVariants}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                                        <motion.a
                                            key={social}
                                            href={`https://${social}.com`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <span className="sr-only">{social}</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                            </svg>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                        
                        {/* Right side - Contact form */}
                        <motion.div 
                            className="md:w-2/3 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
                            variants={itemVariants}
                        >
                            <motion.h2 
                                className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                                variants={itemVariants}
                            >
                                Send us a message
                            </motion.h2>
                            
                            <motion.form 
                                onSubmit={contactSubmit}
                                className="space-y-6"
                                variants={containerVariants}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="firstName">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.fname ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                                <FiUser />
                                            </div>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={fname}
                                                onChange={(e) => setFname(e.target.value)}
                                                onFocus={() => setFormFocus({...formFocus, fname: true})}
                                                onBlur={() => setFormFocus({...formFocus, fname: false})}
                                                placeholder="John"
                                                className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.lname ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                                <FiUser />
                                            </div>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={lname}
                                                onChange={(e) => setLname(e.target.value)}
                                                onFocus={() => setFormFocus({...formFocus, lname: true})}
                                                onBlur={() => setFormFocus({...formFocus, lname: false})}
                                                placeholder="Doe"
                                                className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                                                required
                                            />
                                    </div>
                                    </motion.div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div variants={itemVariants}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.email ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                                <FiMail />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFormFocus({...formFocus, email: true})}
                                                onBlur={() => setFormFocus({...formFocus, email: false})}
                                                placeholder="johndoe@example.com"
                                                className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.phone ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                                <FiPhone />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onFocus={() => setFormFocus({...formFocus, phone: true})}
                                                onBlur={() => setFormFocus({...formFocus, phone: false})}
                                                placeholder="+1 (555) 123-4567"
                                                className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                                                required
                                            />
                            </div>
                                    </motion.div>
                                </div>
                                
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="message">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute left-3 top-4 transition-all ${formFocus.msg ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                            <FiMessageSquare />
                            </div>
                                        <textarea
                                            id="message"
                                            value={msg}
                                            onChange={(e) => setMsg(e.target.value)}
                                            onFocus={() => setFormFocus({...formFocus, msg: true})}
                                            onBlur={() => setFormFocus({...formFocus, msg: false})}
                                            placeholder="Your message here..."
                                            rows={5}
                                            className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                                            required
                                        />
                        </div>
                                </motion.div>
                                
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    variants={buttonVariants}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 flex items-center justify-center transition-all"
                                >
                                    {processing ? (
                                        <FaSpinner className="animate-spin mr-2" />
                                    ) : (
                                        <FiSend className="mr-2" />
                                    )}
                                    {processing ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <motion.div 
                        className="absolute top-20 right-10 w-40 h-40 rounded-full bg-blue-400/10 dark:bg-blue-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1,
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            opacity: { duration: 0.5 },
                            y: { repeat: Infinity, duration: 6 },
                            scale: { repeat: Infinity, duration: 6 }
                        }}
                    />
                    
                    <motion.div 
                        className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-purple-400/10 dark:bg-purple-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1,
                            y: [0, 20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            opacity: { duration: 0.5 },
                            y: { repeat: Infinity, duration: 7, delay: 1 },
                            scale: { repeat: Infinity, duration: 7, delay: 1 }
                        }}
                    />
                </section>
            </main>
            
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Contact;
