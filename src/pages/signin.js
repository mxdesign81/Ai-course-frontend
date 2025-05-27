import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { name, serverURL, websiteURL, facebookClientId } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoComponent from '../components/LogoComponent';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { FiMail, FiLock, FiArrowRight, FiUser } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const SignIn = () => {
    const storedTheme = sessionStorage.getItem('darkMode');
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
  const [formFocus, setFormFocus] = useState({
    email: false,
    password: false
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
    tap: { scale: 0.98 }
  };

    useEffect(() => {
        if (sessionStorage.getItem('auth')) {
            redirectHome();
        }
    }, []);

  const redirectSignUp = () => navigate("/signup");
  const redirectForgot = () => navigate("/forgot");
  const redirectHome = () => navigate("/home");

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

    const handleSignin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showToast('Please fill in all required fields');
            return;
        }
        const postURL = serverURL + '/api/signin';
        try {
            setProcessing(true);
            const response = await axios.post(postURL, { email, password });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', response.data.userData.email);
                sessionStorage.setItem('mName', response.data.userData.mName);
                sessionStorage.setItem('auth', true);
                sessionStorage.setItem('uid', response.data.userData._id);
                sessionStorage.setItem('type', response.data.userData.type);
                if (sessionStorage.getItem('shared') === null) {
                    redirectHome();
                } else {
                    getDataFromDatabase(sessionStorage.getItem('shared'));
                }
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    };

    async function getDataFromDatabase(id) {
        const postURL = serverURL + `/api/shareable?id=${id}`;
        try {
            const response = await axios.get(postURL);
            const dat = response.data[0].content;
            const jsonData = JSON.parse(dat);
            let type = response.data[0].type.toLowerCase();
            let mainTopic = response.data[0].mainTopic;
            const user = sessionStorage.getItem('uid');
            const content = JSON.stringify(jsonData);

            const postURLs = serverURL + '/api/courseshared';
            const responses = await axios.post(postURLs, { user, content, type, mainTopic });
            if (responses.data.success) {
                sessionStorage.removeItem('shared');
                redirectHome();
            } else {
                redirectHome();
            }
        } catch (error) {
      console.log(error);
            redirectHome();
        }
    }

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
              Welcome Back
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-center mb-8"
              variants={itemVariants}
            >
              Sign in to continue your learning journey
            </motion.p>

            <motion.form 
              onSubmit={handleSignin}
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
              
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.password ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <FiLock />
                                </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFormFocus({...formFocus, password: true})}
                    onBlur={() => setFormFocus({...formFocus, password: false})}
                    placeholder="Password"
                    className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                    required
                  />
                            </div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex justify-end"
              >
                <button
                  type="button"
                  onClick={redirectForgot}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
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
                  <FiArrowRight className="mr-2" />
                )}
                {processing ? 'Signing in...' : 'Sign In'}
              </motion.button>
              
              <motion.div 
                className="text-center mt-6"
                variants={itemVariants}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={redirectSignUp}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            </motion.form>
            
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                            </div>
                            </div>

              <div className="mt-6 space-y-4">
                <div className="w-full">
                            <GoogleLogin
                    theme={storedTheme === 'true' ? 'filled_black' : 'outline'}
                    size="large"
                    shape="rectangular"
                    width="100%"
                    text="signin_with"
                                onSuccess={async (credentialResponse) => {
                                    const decoded = jwtDecode(credentialResponse.credential);
                                    let email = decoded.email;
                                    let name = decoded.name;
                                    const postURL = serverURL + '/api/social';
                                    try {
                                        setProcessing(true);
                                        const response = await axios.post(postURL, { email, name });
                                        if (response.data.success) {
                                            showToast(response.data.message);
                                            sessionStorage.setItem('email', decoded.email);
                                            sessionStorage.setItem('mName', decoded.name);
                                            sessionStorage.setItem('auth', true);
                                            sessionStorage.setItem('uid', response.data.userData._id);
                                            sessionStorage.setItem('type', response.data.userData.type);
                                            redirectHome();
                                        } else {
                                            showToast(response.data.message);
                                        }
                                    } catch (error) {
                                        showToast('Internal Server Error');
                                    }
                                }}
                                onError={() => {
                      showToast('Google Sign-in Failed');
                                }}
                            />
                </div>

                <div className="w-full">
                            <FacebookLogin
                                appId={facebookClientId}
                                style={{
                                    backgroundColor: '#4267b2',
                                    color: '#fff',
                      fontSize: '14px',
                      padding: '12px 24px',
                      width: '100%',
                                    border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                                }}
                                onFail={(error) => {
                      showToast('Facebook Sign-in Failed');
                                }}
                                onProfileSuccess={async (response) => {
                                    let email = response.email;
                                    let name = response.name;
                                    const postURL = serverURL + '/api/social';
                                    try {
                                        setProcessing(true);
                                        const response = await axios.post(postURL, { email, name });
                                        if (response.data.success) {
                                            showToast(response.data.message);
                          sessionStorage.setItem('email', email);
                          sessionStorage.setItem('mName', name);
                                            sessionStorage.setItem('auth', true);
                                            sessionStorage.setItem('uid', response.data.userData._id);
                                            sessionStorage.setItem('type', response.data.userData.type);
                                            redirectHome();
                                        } else {
                                            showToast(response.data.message);
                                        }
                                    } catch (error) {
                                        showToast('Internal Server Error');
                                    }
                                }}
                            />
                </div>
                        </div>
            </motion.div>
          </motion.div>
                </div>

        {/* Image/Illustration Side */}
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
                <FiUser className="text-4xl text-blue-600 dark:text-blue-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Learn at your own pace
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Access personalized AI-generated courses tailored to your interests and learning style.
              </p>
              
              <div className="space-y-4">
                {[
                  "Create custom courses on any topic",
                  "Interactive AI tutor helps you learn",
                  "Generate content in 23+ languages",
                  "Track your progress with analytics"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                  </motion.div>
                ))}
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

export default SignIn;