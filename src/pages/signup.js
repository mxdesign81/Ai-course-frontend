import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { company, logo, name, serverURL, websiteURL, facebookClientId } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoComponent from '../components/LogoComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { FiMail, FiLock, FiArrowRight, FiUser, FiShield, FiBookOpen } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const SignUp = () => {
    const storedTheme = sessionStorage.getItem('darkMode');
    const [mName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
  const [formFocus, setFormFocus] = useState({
    name: false,
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

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-gray-200' };
    
    if (password.length < 6) {
      return { width: '30%', color: 'bg-red-500' };
    } else if (password.length < 9) {
      return { width: '60%', color: 'bg-yellow-500' };
    } else {
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (hasNumber && hasSpecial) {
        return { width: '100%', color: 'bg-green-500' };
      } else {
        return { width: '80%', color: 'bg-blue-500' };
      }
    }
  };

    useEffect(() => {
        if (sessionStorage.getItem('auth')) {
            redirectHome();
        }
    }, []);

  const redirectSignIn = () => navigate("/signin");
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

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!mName || !email || !password) {
            showToast('Please fill in all required fields');
            return;
        } else if (password.length < 9) {
            showToast('Password should be at least 9 characters');
            return;
        }
        const postURL = serverURL + '/api/signup';
        const type = 'free';
        try {
            setProcessing(true);
            const response = await axios.post(postURL, { email, mName, password, type });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('mName', mName);
                sessionStorage.setItem('auth', true);
                sessionStorage.setItem('uid', response.data.userId);
                sessionStorage.setItem('type', 'free');
                sendEmail(email, mName);
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    };

    async function sendEmail(mEmail, mName) {
        try {
            const dataToSend = {
                subject: `Welcome to ${name}`,
                to: mEmail,
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
         <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Welcome to Coursea<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                 </div>
                
                  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                      <tr style="width:100%">
                        <td>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                            <tbody>
                              <tr>
                                <td><img alt="Vercel" src="${logo}" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                              </tr>
                            </tbody>
                          </table>
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Welcome to <strong>${name}</strong></h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hello <strong>${mName}</strong>,</p>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Welcome to <strong>${name}</strong>, Unleash your AI potential with our platform, offering a seamless blend of theory and video courses. Dive into comprehensive lessons, from foundational theories to real-world applications, tailored to your learning preferences. Experience the future of AI education with Coursea – where theory meets engaging visuals for a transformative learning journey!.</p>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                            <tbody>
                              <tr>
                                <td><a href="${websiteURL}" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"><span>Get Started</span></a></td>
                              </tr>
                            </tbody>
                          </table>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Best,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>${company}</strong> Team</p></p>
                          </td>
                      </tr>
                    </table>
                  </body>
                
                </html>`
            };
            const postURL = serverURL + '/api/data';
            await axios.post(postURL, dataToSend).then(res => {
                redirectHome();
            }).catch(error => {
                redirectHome();
            });
        } catch (error) {
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
              Create Account
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-center mb-8"
              variants={itemVariants}
            >
              Join today and start generating AI courses
            </motion.p>
            
            <motion.form 
              onSubmit={handleSignup}
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={mName}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFormFocus({...formFocus, name: true})}
                    onBlur={() => setFormFocus({...formFocus, name: false})}
                    placeholder="Full name"
                    className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                    required
                  />
                </div>
              </motion.div>
              
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
                    placeholder="Password (min. 9 characters)"
                    className="w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                    required
                  />
                                </div>
                
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${getPasswordStrength().color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: getPasswordStrength().width }}
                        transition={{ duration: 0.3 }}
                      />
                            </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {password.length < 9 
                        ? "Password must be at least 9 characters" 
                        : "Strong passwords include numbers and special characters"}
                    </p>
                                </div>
                )}
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
                {processing ? 'Creating account...' : 'Create Account'}
              </motion.button>
              
              <motion.div 
                className="text-center mt-6"
                variants={itemVariants}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
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
                    text="signup_with"
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
                                            sendEmail(decoded.email, decoded.name);
                                        } else {
                                            showToast(response.data.message);
                                        }
                                    } catch (error) {
                                        showToast('Internal Server Error');
                                    }
                                }}
                                onError={() => {
                      showToast('Google Sign-up Failed');
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
                      showToast('Facebook Sign-up Failed');
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
                          sendEmail(email, name);
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
        <div className="hidden lg:flex lg:w-1/2 bg-purple-50 dark:bg-gray-800 items-center justify-center relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 dark:from-purple-500/10 dark:to-blue-500/10"
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
                <FiBookOpen className="text-4xl text-purple-600 dark:text-purple-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your AI Learning Journey Starts Here
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Create a free account to unlock the power of AI-generated courses and personalized learning.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4">
                {[
                  {
                    title: "Free to Start",
                    description: "Begin your learning journey with our free tier",
                    icon: <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  },
                  {
                    title: "Personalized Learning",
                    description: "Courses tailored to your specific needs",
                    icon: <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  },
                  {
                    title: "Secure Account",
                    description: "Your data is always protected and private",
                    icon: <FiShield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
                </div>
            </div>
          </motion.div>
          
          {/* Animated Shapes */}
          <motion.div
            className="absolute top-10 right-10 w-24 h-24 rounded-full bg-purple-400/20 dark:bg-purple-500/20"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
          
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-blue-400/20 dark:bg-blue-500/20"
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

export default SignUp;