import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { name, serverURL, websiteURL, company, logo } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoComponent from '../components/LogoComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiLock, FiArrowRight, FiShield, FiCheck, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const ResetPassword = () => {
    const storedTheme = sessionStorage.getItem('darkMode');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);
  const [formFocus, setFormFocus] = useState({
    password: false,
    confirmPassword: false
  });

    const navigate = useNavigate();
    const { token } = useParams();

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
  
  // Password match validation
  const passwordsMatch = password && confirmpassword && password === confirmpassword;
  const showPasswordMatchFeedback = password && confirmpassword;

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

    const handleReset = async (e) => {
        e.preventDefault();
        if (!password || !confirmpassword) {
            showToast('Please fill in all required fields');
            return;
        } else if (password !== confirmpassword) {
            showToast('The password and confirm password do not match');
            return;
        } else if (password.length < 9) {
            showToast('Password should be at least 9 characters');
            return;
        }
        const postURL = serverURL + '/api/reset-password';

        try {
            setProcessing(true);
            const response = await axios.post(postURL, { password, token });
            if (response.data.success) {
                showToast(response.data.message);
                sendEmail(response.data.email);
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    };

    async function sendEmail(mEmail) {
        const signInLink = websiteURL + '/signin';
        try {
            const dataToSend = {
                subject: `${name} Password Updated`,
                to: mEmail,
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
                 <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Password Updated<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
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
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Password Updated</h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Your account ${mEmail} has had its password updated.</p>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                            <tbody>
                              <tr>
                                <td><a href="${signInLink}" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"</span><span>SignIn</span></a></td>
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
                redirectSignIn();
            }).catch(error => {
                redirectSignIn();
            });
        } catch (error) {
            redirectSignIn();
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
              Reset Password
            </motion.h1>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-center mb-8"
              variants={itemVariants}
            >
              Create a new secure password for your account
            </motion.p>

            <motion.form 
              onSubmit={handleReset}
              className="space-y-6"
              variants={containerVariants}
            >
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
                    placeholder="New password (min. 9 characters)"
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
              
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all ${formFocus.confirmPassword ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    <FiLock />
                        </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFormFocus({...formFocus, confirmPassword: true})}
                    onBlur={() => setFormFocus({...formFocus, confirmPassword: false})}
                    placeholder="Confirm new password"
                    className={`w-full px-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all ${
                      showPasswordMatchFeedback 
                        ? passwordsMatch 
                          ? 'border-green-500 dark:border-green-500' 
                          : 'border-red-500 dark:border-red-500'
                        : ''
                    }`}
                    required
                  />
                  
                  {showPasswordMatchFeedback && (
                    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      passwordsMatch ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {passwordsMatch ? <FiCheck /> : <FiX />}
                    </div>
                  )}
                </div>

                {showPasswordMatchFeedback && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
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
                {processing ? 'Updating Password...' : 'Reset Password'}
              </motion.button>
              
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
                <FiShield className="text-4xl text-purple-600 dark:text-purple-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Create a Secure Password
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Strong passwords help protect your account and personal information.
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Use at least 9 characters",
                    description: "Longer passwords are harder to crack",
                    icon: <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  },
                  {
                    title: "Mix characters and numbers",
                    description: "Include uppercase, lowercase, numbers, and symbols",
                    icon: <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  },
                  {
                    title: "Don't reuse passwords",
                    description: "Use unique passwords for different accounts",
                    icon: <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  }
                ].map((tip, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {tip.description}
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

export default ResetPassword;