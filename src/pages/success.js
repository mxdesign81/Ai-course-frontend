import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { 
  FiCheck, FiDownload, FiMail, FiCalendar, FiCreditCard, 
  FiUser, FiDollarSign, FiArrowRight, FiHome, FiBookOpen,
  FiLoader, FiPrinter, FiShare2
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { MonthCost, MonthType, YearCost, company, logo, serverURL } from '../constants';
import ReceiptDisplay from '../components/receiptDisplay';
import ReceiptDisplayRazorpay from '../components/receiptDisplayRazorpay';
import ReceiptDisplayStripe from '../components/receiptDisplayStripe';
import ReceiptDisplayPayStack from '../components/receiptDisplayPayStack';
import SubscriptionDetailsFlutterwave from '../components/subscriptionDetailsFlutterwave';

const Success = () => {
    const [processing, setProcessing] = useState(false);
    const [jsonData, setJsonData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.5
      }
    }
  };

    useEffect(() => {
    // Trigger confetti celebration
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 800);

        getDetails();

    return () => clearTimeout(timer);
    }, []);

  const getDetails = async () => {
    try {
      const method = sessionStorage.getItem('method');
      
      if (method === 'stripe') {
            const dataToSend = {
                subscriberId: sessionStorage.getItem('stripe'),
                uid: sessionStorage.getItem('uid'),
                plan: sessionStorage.getItem('plan')
            };
        const response = await axios.post(`${serverURL}/api/stripedetails`, dataToSend);
        setJsonData(response.data);
                sessionStorage.setItem('type', sessionStorage.getItem('plan'));
                setIsLoading(false);
        sendEmail(response.data);
      } else if (method === 'paystack') {
            const dataToSend = {
                email: sessionStorage.getItem('email'),
                uid: sessionStorage.getItem('uid'),
                plan: sessionStorage.getItem('plan')
            };
        const response = await axios.post(`${serverURL}/api/paystackfetch`, dataToSend);
        setJsonData(response.data.details);
                sessionStorage.setItem('type', sessionStorage.getItem('plan'));
                setIsLoading(false);
        sendEmail(response.data.details);
      } else if (method === 'flutterwave') {
            const dataToSend = {
                email: sessionStorage.getItem('email'),
                uid: sessionStorage.getItem('uid'),
                plan: sessionStorage.getItem('plan')
            };
        const response = await axios.post(`${serverURL}/api/flutterdetails`, dataToSend);
        setJsonData(response.data);
                sessionStorage.setItem('type', sessionStorage.getItem('plan'));
                setIsLoading(false);
        sendEmail(response.data);
        } else {
            const currentUrl = window.location.href;
            const urlParams = new URLSearchParams(currentUrl);
            let subscriptionId = '';
            urlParams.forEach((value, key) => {
                if (key.includes('subscription_id')) {
                    subscriptionId = value;
                }
            });
        
            const dataToSend = {
                subscriberId: subscriptionId,
                uid: sessionStorage.getItem('uid'),
                plan: sessionStorage.getItem('plan')
            };
        
        if (method === 'paypal') {
          const response = await axios.post(`${serverURL}/api/paypaldetails`, dataToSend);
          setJsonData(response);
                        sessionStorage.setItem('type', sessionStorage.getItem('plan'));
                        setIsLoading(false);
          sendEmail(response);
        } else if (method === 'razorpay') {
          const response = await axios.post(`${serverURL}/api/razorapydetails`, dataToSend);
          setJsonData(response.data);
                        sessionStorage.setItem('type', sessionStorage.getItem('plan'));
                        setIsLoading(false);
          sendEmail(response.data);
        }
                }
            } catch (error) {
      setIsLoading(false);
      showToast('Failed to load payment details');
    }
  };

  const sendEmail = async (jsonData) => {
    try {
      const emailData = {
        email: sessionStorage.getItem('email'),
        name: sessionStorage.getItem('mName'),
        plan: sessionStorage.getItem('plan'),
        amount: sessionStorage.getItem('plan') === 'Monthly Plan' ? MonthCost : YearCost,
        method: sessionStorage.getItem('method')
      };
      await axios.post(`${serverURL}/api/sendemail`, emailData);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const showToast = (msg) => {
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

  const downloadReceipt = () => {
    // Implementation for downloading receipt
    showToast('Receipt download started');
  };

  const shareSuccess = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just subscribed to AI Course Platform!',
        text: 'Check out this amazing AI-powered learning platform',
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      showToast('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <Header isHome={true} className="sticky top-0 z-50" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 mx-1 rounded-full bg-blue-600 dark:bg-blue-400"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.15
                  }}
                />
              ))}
                    </div>
            <p className="text-gray-600 dark:text-gray-300">Processing your payment...</p>
          </div>
        </div>
        <Footers className="sticky bottom-0 z-50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <Header isHome={true} className="sticky top-0 z-50" />
      
      <main className="flex-1 py-12 px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              className="mx-auto w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6"
              variants={checkmarkVariants}
            >
              <FiCheck className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Welcome to AI Course Platform Premium
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Your subscription is now active and ready to use
            </p>
          </motion.div>

          {/* Payment Summary */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiCreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Summary
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Customer</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {sessionStorage.getItem('mName')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiMail className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {sessionStorage.getItem('email')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiBookOpen className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Plan</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {sessionStorage.getItem('plan')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        ${sessionStorage.getItem('plan') === 'Monthly Plan' ? MonthCost : YearCost}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiCreditCard className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Payment Method</div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {sessionStorage.getItem('method')}
                    </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" size={16} />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.button
              onClick={() => navigate('/course')}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiBookOpen />
              Start Learning
            </motion.button>

            <motion.button
              onClick={() => setShowReceipt(!showReceipt)}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPrinter />
              View Receipt
            </motion.button>

            <motion.button
              onClick={shareSuccess}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiShare2 />
              Share
            </motion.button>
          </motion.div>

          {/* Receipt Details */}
          <AnimatePresence>
            {showReceipt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Receipt Details
                    </h2>
                    <motion.button
                      onClick={downloadReceipt}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiDownload size={16} />
                      Download
                    </motion.button>
                    </div>

                  {/* Render appropriate receipt component based on payment method */}
                  {sessionStorage.getItem('method') === 'flutterwave' ? (
                    <SubscriptionDetailsFlutterwave 
                      jsonData={jsonData} 
                      method={sessionStorage.getItem('method')} 
                      plan={sessionStorage.getItem('plan')} 
                    />
                  ) : sessionStorage.getItem('method') === 'stripe' ? (
                    <ReceiptDisplayStripe 
                      jsonData={jsonData} 
                      plan={sessionStorage.getItem('type')} 
                      method={sessionStorage.getItem('method')} 
                    />
                  ) : sessionStorage.getItem('method') === 'paystack' ? (
                    <ReceiptDisplayPayStack 
                      jsonData={jsonData} 
                      plan={sessionStorage.getItem('type')} 
                      method={sessionStorage.getItem('method')} 
                    />
                  ) : sessionStorage.getItem('method') === 'paypal' ? (
                    <ReceiptDisplay 
                      jsonData={jsonData} 
                      plan={sessionStorage.getItem('type')} 
                      method={sessionStorage.getItem('method')} 
                    />
                  ) : (
                    <ReceiptDisplayRazorpay 
                      jsonData={jsonData} 
                      plan={sessionStorage.getItem('type')} 
                      method={sessionStorage.getItem('method')} 
                    />
                  )}
                    </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* What's Next */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What's Next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Get Started</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    Create your first AI-powered course
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    Explore premium features and tools
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    Join our community of learners
                  </li>
                </ul>
                        </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    24/7 customer support available
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    Access to knowledge base and tutorials
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                    Regular updates and new features
                  </li>
                </ul>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-green-500/5 to-emerald-500/5 dark:from-green-600/10 dark:to-emerald-600/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-green-500/5 to-emerald-500/5 dark:from-green-600/10 dark:to-emerald-600/10 -z-10"></div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Success;