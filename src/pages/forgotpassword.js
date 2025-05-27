import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { name, serverURL, websiteURL, company, logo } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoComponent from '../components/LogoComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiArrowRight, FiKey, FiClock } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const ForgotPassword = () => {
    const storedTheme = sessionStorage.getItem('darkMode');
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [seconds, setSeconds] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [formFocus, setFormFocus] = useState({
    email: false
  });

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
      transition: { duration: 0.5 }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.7 }
  };

    useEffect(() => {
        function redirectHome() {
            navigate("/home");
        }

        if (sessionStorage.getItem('auth')) {
            redirectHome();
        }

        let timer;

        if (isTimerRunning) {
            timer = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 1) {
                        clearInterval(timer);
                        setIsTimerRunning(false);
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
  }, [isTimerRunning, navigate]);

    const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  
  const redirectSignIn = () => navigate("/signin");

    const showToast = async (msg) => {
        setProcessing(false);
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

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email) {
            showToast('Please fill in all required fields');
            return;
        }
        const postURL = serverURL + '/api/forgot';
        try {
            setProcessing(true);
            const response = await axios.post(postURL, { email, name, company, logo });
            if (response.data.success) {
                showToast(response.data.message);
                setSeconds(60);
                setIsTimerRunning(true);
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    };

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Header */}
      <header className="w-full p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.a 
            href={websiteURL}
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
                            <LogoComponent isDarkMode={storedTheme} />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {name}
            </span>
          </motion.a>
                        <DarkModeToggle />
        </div>
      </header>

      {/* Content */}
      <motion.div 
        className="flex flex-1 w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Form Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 md:px-8 py-8">
          <motion.div 
            className="w-full max-w-md mx-auto"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
              variants={itemVariants}
            >
              Forgot Password?
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-center mb-8"
              variants={itemVariants}
            >
              Enter your email and we'll send you a link to reset your password
            </motion.p>

            <motion.form 
              onSubmit={handleReset}
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
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
                    placeholder="Email address"
                    className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                    required
                  />
                            </div>
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={isTimerRunning || processing}
                variants={buttonVariants}
                initial="rest"
                whileHover={isTimerRunning ? "disabled" : "hover"}
                whileTap={isTimerRunning ? "disabled" : "tap"}
                animate={isTimerRunning ? "disabled" : "rest"}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : isTimerRunning ? (
                  <FiClock className="mr-2" />
                ) : (
                  <FiArrowRight className="mr-2" />
                )}
                {processing 
                  ? 'Sending...' 
                  : isTimerRunning 
                    ? `Resend in ${formattedTime}` 
                    : 'Send Reset Link'
                }
              </motion.button>
              
              {isTimerRunning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Check your email for the password reset link
                </motion.div>
              )}
              
              <motion.div 
                className="text-center mt-6"
                variants={itemVariants}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={redirectSignIn}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            </motion.form>
          </motion.div>
                        </div>

        {/* Illustration Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-50 dark:bg-gray-800 items-center justify-center relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          
          <motion.div
            className="relative z-10 max-w-lg px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg"
              >
                <FiKey className="text-4xl text-blue-600 dark:text-blue-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Password Recovery
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We'll send you a secure link to reset your password and get back to your learning journey.
              </p>
              
              <div className="space-y-4">
                <motion.div
                  className="flex items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Check Your Email
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Look for a message with a secure reset link
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Create a Strong Password
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose a secure, unique password
                    </p>
                </div>
                </motion.div>
                
                <motion.div
                  className="flex items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Continue Your Learning
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get back to your AI courses seamlessly
                    </p>
                  </div>
                </motion.div>
                </div>
            </div>
          </motion.div>
          
          {/* Animated Shapes */}
          <motion.div
            className="absolute top-10 right-10 w-24 h-24 rounded-full bg-blue-400/20 dark:bg-blue-500/20"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
          
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-purple-400/20 dark:bg-purple-500/20"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 6, delay: 1 }}
          />
        </div>
      </motion.div>
    </div>
    );
};

export default ForgotPassword;