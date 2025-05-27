import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';
import axios from 'axios';
import SubscriptionDetails from '../components/subscriptionDetails';
import { FiCheckCircle } from 'react-icons/fi';

const Successful = () => {
    const [jsonData, setJsonData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [method, setMethod] = useState('');
    const [error, setError] = useState(false);
    
    const userName = sessionStorage.getItem('mName') || 'User';
    const planType = sessionStorage.getItem('type') || 'Subscription';
    const planPrice = sessionStorage.getItem('price') || '0';
    const billingDate = sessionStorage.getItem('billing') || 'next billing date';

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

    useEffect(() => {
        getDetails();
    }, []);

    async function getDetails() {
        const dataToSend = {
            uid: sessionStorage.getItem('uid')
        };
        try {
            setIsLoading(true);
            const postURL = serverURL + '/api/subscriptiondetail';
            const response = await axios.post(postURL, dataToSend);
            setJsonData(response.data.session);
            setMethod(response.data.method);
                setIsLoading(false);
                sendUpdate();
        } catch (error) {
            console.error("Error fetching subscription details:", error);
            setError(true);
            setIsLoading(false);
        }
    }

    async function sendUpdate() {
        try {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(currentUrl);
        let subscriptionId = '';
            
        urlParams.forEach((value, key) => {
            if (key.includes('subscription_id')) {
                subscriptionId = value;
            }
        });
            
        const dataToSend = {
            id: subscriptionId,
            mName: sessionStorage.getItem('mName'),
            email: sessionStorage.getItem('email'),
            user: sessionStorage.getItem('uid'),
            plan: sessionStorage.getItem('type')
        };
            
            const postURL = serverURL + '/api/paypalupdateuser';
            await axios.post(postURL, dataToSend);
        } catch (error) {
            console.error("Error updating subscription:", error);
        }
    }

    // Loader animation
    const loaderVariants = {
        start: {
            scale: 1
        },
        end: {
            scale: [1, 1.1, 1],
            transition: {
                repeat: Infinity,
                duration: 1.2
            }
        }
    };

    return (
        <div className='min-h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            
            <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
                <motion.section 
                    className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div 
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div 
                                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        '0 0 0 0 rgba(74, 222, 128, 0.4)',
                                        '0 0 0 10px rgba(74, 222, 128, 0)',
                                        '0 0 0 0 rgba(74, 222, 128, 0)'
                                    ]
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 2 
                                }}
                            >
                                <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </motion.div>
                        </div>
                        
                        <motion.h1 
                            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400"
                            variants={itemVariants}
                        >
                            Thank You! 🎉
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
                            variants={itemVariants}
                        >
                            <strong>{userName}</strong>, you have successfully modified your plan to <span className="font-semibold text-blue-600 dark:text-blue-400">{planType}</span>.
                            <br />
                            You will be charged <span className="font-semibold text-blue-600 dark:text-blue-400">${planPrice}</span> from {new Date(billingDate).toLocaleDateString()}.
                        </motion.p>
                    </motion.div>
                    
                    {isLoading ? (
                        <motion.div 
                            className="flex justify-center py-10"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full"
                                variants={loaderVariants}
                                initial="start"
                                animate="end"
                            />
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                            variants={itemVariants}
                        >
                            <p className="text-red-500 dark:text-red-400 text-lg">
                                There was an error loading your subscription details. Please contact support.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants}>
                            <SubscriptionDetails jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />
                        </motion.div>
                    )}
                    
                    {/* Decorative elements */}
                    <motion.div 
                        className="absolute top-20 right-10 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5"
                        animate={{ 
                            y: [0, -15, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 8 }}
                    />
                    
                    <motion.div 
                        className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-green-400/5 dark:bg-green-500/5"
                        animate={{ 
                            y: [0, 15, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 9, delay: 1 }}
                    />
                </motion.section>
            </main>
            
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Successful;
