import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiX, FiRefreshCw, FiArrowLeft, FiAlertTriangle, 
  FiHelpCircle, FiMail, FiPhone 
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';

const Failed = () => {
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

  const iconVariants = {
    hidden: { scale: 0, rotate: 180 },
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

  const redirectPricing = () => {
      navigate("/pricing");
  };

  const redirectHome = () => {
    navigate("/");
  };

  const contactSupport = () => {
    // You can implement contact support functionality here
    window.location.href = "mailto:support@example.com";
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
          {/* Failed Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mb-6"
              variants={iconVariants}
            >
              <FiX className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              We couldn't process your payment
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Don't worry, you can try again or contact our support team
            </p>
          </motion.div>

          {/* Error Information */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiAlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  What happened?
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Your payment could not be processed. This might happen due to:
                </p>
                
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Card declined by your bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Incorrect payment information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <span>Network or technical issues</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <motion.button
              onClick={redirectPricing}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiRefreshCw />
              Try Again
            </motion.button>

            <motion.button
              onClick={redirectHome}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft />
              Go Home
            </motion.button>
          </motion.div>

          {/* Help Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiHelpCircle className="text-blue-600 dark:text-blue-400" size={20} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Need Help?
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you continue to experience issues, our support team is here to help you complete your purchase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                onClick={contactSupport}
                className="flex items-center gap-3 p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiMail className="text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Email Support
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Get help via email
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => window.location.href = "tel:+1234567890"}
                className="flex items-center gap-3 p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPhone className="text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Call Support
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Speak with our team
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tips for successful payment
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Ensure your card has sufficient funds</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Check that your billing information is correct</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Try using a different payment method</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Contact your bank if the issue persists</span>
                </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-red-500/5 to-rose-500/5 dark:from-red-600/10 dark:to-rose-600/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-red-500/5 to-rose-500/5 dark:from-red-600/10 dark:to-rose-600/10 -z-10"></div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Failed;