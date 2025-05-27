import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCheck, FiStar, FiZap, FiShield, FiRefreshCw, 
  FiX, FiRotateCcw, FiMail, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { FreeType, FreeCost, FreeTime, MonthType, MonthTime, MonthCost, YearType, YearCost, YearTime } from '../constants';
import PricingPlan from '../components/pricing';

const Pricing = () => {
    const { state } = useLocation();
    const { header } = state || false;
  const [expandedItem, setExpandedItem] = useState(null);

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

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Pricing data
  const freeData = {
    type: FreeType,
    cost: FreeCost,
    time: FreeTime,
    features: [
      "Generate 5 Sub-Topics",
      "Create Unlimited Course",
      "Video & Theory Course",
      "Lifetime access",
      "Theory & Image Course",
      "Course In 23+ Languages",
      "Ai Teacher Chat"
    ]
  };

  const monthData = {
    type: MonthType,
    cost: MonthCost,
    time: `/${MonthTime}`,
    features: [
      "Generate 10 Sub-Topics",
      "Create Unlimited Course",
      "Video & Theory Course",
      "1 Month Access",
      "Theory & Image Course",
      "Course In 23+ Languages",
      "Ai Teacher Chat"
    ]
  };

  const yearData = {
    type: YearType,
    cost: YearCost,
    time: `/${YearTime}`,
    features: [
      "Generate 10 Sub-Topics",
      "Create Unlimited Course",
      "Video & Theory Course",
      "1 Year Access",
      "Theory & Image Course",
      "Course In 23+ Languages",
      "Ai Teacher Chat"
    ],
    popular: true
  };

  const benefits = [
    {
      icon: <FiRotateCcw className="text-4xl text-blue-600 dark:text-blue-400" />,
      title: "Flexible Pricing",
      description: "Tailor costs to usage needs for optimal budgeting flexibility"
    },
    {
      icon: <FiStar className="text-4xl text-yellow-600 dark:text-yellow-400" />,
      title: "Upgrade Anytime",
      description: "Seamlessly scale plans to match evolving requirements at any moment"
    },
    {
      icon: <FiX className="text-4xl text-red-600 dark:text-red-400" />,
      title: "Cancel Subscription Anytime",
      description: "Terminate subscription anytime, providing ultimate flexibility and user control"
    }
  ];

  const faqData = [
    { 
      question: 'What is our cancellation policy?', 
      answer: (
        <p>
          You can read our cancellation policy from{' '}
          <span 
            className='text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300' 
            onClick={() => navigate("/cancellation")}
          >
            here
          </span>
        </p>
      )
    },
    { 
      question: 'What is our refund policy?', 
      answer: (
        <p>
          You can read our refund policy from{' '}
          <span 
            className='text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300' 
            onClick={() => navigate("/refund")}
          >
            here
          </span>
        </p>
      )
    },
    { 
      question: 'What is our subscription and billing policy?', 
      answer: (
        <p>
          You can read our subscription and billing policy from{' '}
          <span 
            className='text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300' 
            onClick={() => navigate("/billing")}
          >
            here
          </span>
        </p>
      )
    },
    { 
      question: 'What are the available payment gateways?', 
      answer: 'Our platform supports multiple payment gateways, including PayPal, Stripe, Razorpay, Paystack, and Flutterwave for your convenience.' 
    },
  ];

    const handleExpand = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

  const PricingCard = ({ plan, index }) => {
    return (
      <motion.div
        variants={cardVariants}
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
          plan.popular 
            ? 'border-blue-500 dark:border-blue-400 scale-105' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        whileHover={{ y: -5 }}
      >
        {plan.popular && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.type}
            </h3>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.cost}
              </span>
              {plan.time && (
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  {plan.time}
                </span>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0" size={16} />
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <motion.button
            onClick={() => {
              if (plan.type === FreeType) {
                navigate('/signup');
              } else {
                navigate('/payment', { state: { plan: plan.type } });
              }
            }}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              plan.popular
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.type === FreeType ? 'Get Started Free' : 'Choose Plan'}
          </motion.button>
        </div>
      </motion.div>
    );
  };

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
            <Header isHome={header} className="sticky top-0 z-50" />
      
      <main className="flex-1 py-12 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              Pricing Plans
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose the Perfect Plan for Your Success
                    </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <PricingCard plan={freeData} index={0} />
            <PricingCard plan={monthData} index={1} />
            <PricingCard plan={yearData} index={2} />
          </motion.div>

          {/* Benefits Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Pricing Benefits
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Why choose our flexible pricing model
              </p>
                        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 text-center"
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                        </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
                    </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Get answers to common questions about our pricing
              </p>
                        </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                  variants={cardVariants}
                >
                  <motion.button
                                        onClick={() => handleExpand(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    {expandedItem === index ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                                    {expandedItem === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                                            {item.answer}
                                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Our support team is here to help you choose the right plan
            </p>
            <motion.button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMail />
              Contact Support
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Pricing;
