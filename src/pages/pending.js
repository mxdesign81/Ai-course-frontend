import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FiClock, FiRefreshCw, FiExternalLink, FiCheck, 
  FiAlertCircle, FiLoader, FiArrowLeft 
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL, websiteURL } from '../constants';

const Pending = () => {
    const { state } = useLocation();
    const { sub, link } = state || {};
    const [processing, setProcessing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);

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

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh]);

  const showToast = (msg) => {
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

  const refresh = async () => {
    if (!sub) {
      showToast('No subscription ID found');
      return;
    }

        try {
            setProcessing(true);
      const response = await axios.post(`${serverURL}/api/razorapypending`, { sub });
      
      if (response.data.status === 'active') {
        setProcessing(false);
        const approveHref = `${websiteURL}/success?subscription_id=${sub}`;
                    window.location.href = approveHref;
      } else if (response.data.status === 'expired' || response.data.status === 'cancelled') {
        setProcessing(false);
        const failedHref = `${websiteURL}/failed`;
        window.location.href = failedHref;
      } else {
                    showToast("Payment is still pending");
                }
        } catch (error) {
      showToast('Failed to check payment status');
    }
  };

  const openPaymentLink = () => {
    if (link) {
        window.open(link, '_blank');
    }
  };

  const goBack = () => {
    navigate('/pricing');
  };

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
            <Header isHome={true} className="sticky top-0 z-50" />
      
      <main className="flex-1 py-12 px-4">
        <motion.div 
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pending Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6"
              variants={pulseVariants}
              animate="animate"
            >
              <FiClock className="w-12 h-12 text-white" strokeWidth={2} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 mb-4">
              Payment Pending
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Waiting for payment confirmation
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Please complete your payment to activate your subscription
            </p>
          </motion.div>

          {/* Status Information */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Status
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Payment is being processed...
                  </span>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                    <strong>Hello {sessionStorage.getItem('mName')},</strong> please complete your payment using the link below. 
                    Once payment is confirmed, your subscription will be activated automatically.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <motion.button
              onClick={openPaymentLink}
              disabled={!link}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: link ? 1.02 : 1 }}
              whileTap={{ scale: link ? 0.98 : 1 }}
            >
              <FiExternalLink />
              Complete Payment
            </motion.button>

            <motion.button
              onClick={refresh}
              disabled={processing}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all disabled:opacity-50"
              whileHover={{ scale: processing ? 1 : 1.02 }}
              whileTap={{ scale: processing ? 1 : 0.98 }}
            >
              {processing ? (
                <>
                  <FiLoader className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <FiRefreshCw />
                  Check Status
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Auto-refresh Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Auto-refresh
              </h3>
              <motion.button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </motion.button>
            </div>
            
            {autoRefresh && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FiClock size={16} />
                <span className="text-sm">
                  Next check in {countdown} seconds
                </span>
              </div>
            )}
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              We'll automatically check your payment status every 30 seconds
            </p>
          </motion.div>

          {/* Instructions */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What to do next?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Complete your payment</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Click "Complete Payment" to open the payment link in a new tab
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Wait for confirmation</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      After payment, return to this page. We'll automatically detect the payment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Start learning</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Once confirmed, you'll be redirected to start using your premium features
                    </p>
                  </div>
                </div>
                </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft size={16} />
              Back to pricing
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-yellow-500/5 to-orange-500/5 dark:from-yellow-600/10 dark:to-orange-600/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-yellow-500/5 to-orange-500/5 dark:from-yellow-600/10 dark:to-orange-600/10 -z-10"></div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Pending;
