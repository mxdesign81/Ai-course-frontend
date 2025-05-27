import React from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCalendar, FiHash, FiClock, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const SubscriptionDetails = ({ jsonData, plan, method }) => {
  if (!jsonData || !jsonData.id) return null;

    const {
        id,
        start_time,
        billing_info,
    } = jsonData;

  // Store the subscription details in session storage
    sessionStorage.setItem('subscriberId', id);
    sessionStorage.setItem('billing', billing_info.next_billing_time);
  
  // Format the amount with currency symbol
  const amount = billing_info.last_payment.amount.value;
  const currency = billing_info.last_payment.amount.currency_code;
  const formattedAmount = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

    return (
    <motion.div 
      className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="p-6 md:p-8">
        <motion.div 
          className="flex items-center justify-center mb-6"
          variants={itemVariants}
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8"
          variants={itemVariants}
        >
          Subscription Details
        </motion.h2>
        
        <div className="space-y-6">
          <motion.div 
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCreditCard className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Payment Method</div>
              <div className="font-medium text-gray-900 dark:text-white">{method.toUpperCase()}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCalendar className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Plan</div>
              <div className="font-medium text-gray-900 dark:text-white">{plan}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiHash className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Subscription ID</div>
              <div className="font-medium text-gray-900 dark:text-white overflow-x-auto">{id}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiClock className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Start Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{formatDate(start_time)}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCalendar className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Next Billing Time</div>
              <div className="font-medium text-gray-900 dark:text-white">{formatDate(billing_info.next_billing_time)}</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            variants={itemVariants}
          >
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <FiDollarSign className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Amount</div>
              <div className="font-medium text-gray-900 dark:text-white">{formattedAmount}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
    );
};

export default SubscriptionDetails;