import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FiCreditCard, FiCalendar, FiDollarSign, FiSettings, 
  FiX, FiCheck, FiLoader, FiAlertTriangle, FiRefreshCw,
  FiShield, FiUser, FiMail, FiClock
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { MonthCost, MonthType, YearCost, YearType, paypalPlanIdOne, paypalPlanIdTwo, serverURL } from '../constants';
import SubscriptionDetails from '../components/subscriptionDetails';
import SubscriptionDetailsRazorpay from '../components/subscriptionDetailsRazorpay';
import SubscriptionDetailsStripe from '../components/subscriptionDetailsStripe';
import SubscriptionDetailsPayStack from '../components/subscriptionDetailsPayStack';
import SubscriptionDetailsFlutterwave from '../components/subscriptionDetailsFlutterwave';

const Manage = () => {
    const [jsonData, setJsonData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [method, setMethod] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processing2, setProcessing2] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

    useEffect(() => {
        if (sessionStorage.getItem('type') === 'free') {
            navigate("/pricing");
        } else {
            getDetails();
        }
    }, []);

    async function getDetails() {
        const dataToSend = {
            uid: sessionStorage.getItem('uid'),
            email: sessionStorage.getItem('email'),
        };
        try {
            const postURL = serverURL + '/api/subscriptiondetail';
            await axios.post(postURL, dataToSend).then(res => {
                setJsonData(res.data.session);
                setMethod(res.data.method);
                sessionStorage.setItem('method', res.data.method);
                setIsLoading(false);
            });
        } catch (error) {
      setIsLoading(false);
      showToast('Failed to load subscription details');
        }
    }

    const showToast = async (msg) => {
        setProcessing(false);
        setProcessing2(false);
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    async function modifySubscription() {
        if (method === 'paypal') {
            let planName = sessionStorage.getItem('type');
            let planId;
            let planPrice;
            if (planName === YearType) {
                planPrice = MonthCost;
                planId = paypalPlanIdOne;
                planName = MonthType;
                sessionStorage.setItem('type', planName);
                sessionStorage.setItem('price', planPrice);
            } else {
                planId = paypalPlanIdTwo;
                planName = YearType;
                planPrice = YearCost;
                sessionStorage.setItem('type', planName);
                sessionStorage.setItem('price', planPrice);
            }
            const dataToSend = {
                id: sessionStorage.getItem('subscriberId'),
                idPlan: planId,
            };
            try {
                setProcessing2(true);
                const postURL = serverURL + '/api/paypalupdate';
                const res = await axios.post(postURL, dataToSend);
                const links = res.data.links;
                const approveLink = links.find(link => link.rel === "approve");
                const approveHref = approveLink ? approveLink.href : null;
                window.location.href = approveHref;
            } catch (error) {
                modifySubscription();
            }
        } else {
      showToast("You cannot modify the plan. Use PayPal payment method to modify plan");
        }
    }

    async function cancelSubscription() {
        const dataToSend = {
            id: jsonData.id
        };
        try {
            setProcessing(true);
            if (method === 'stripe') {
                const postURL = serverURL + '/api/stripecancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            } else if (method === 'paypal') {
                const postURL = serverURL + '/api/paypalcancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            } else if (method === 'paystack') {
                const dataToSends = {
                    code: jsonData.subscription_code,
                    token: jsonData.email_token,
                    email: sessionStorage.getItem('email')
                };
                const postURL = serverURL + '/api/paystackcancel';
                await axios.post(postURL, dataToSends).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
      } else if (method === 'flutterwave') {
                const dataToSends = {
                    code: jsonData.id,
                    token: jsonData.plan,
                    email: sessionStorage.getItem('email')
                };
                const postURL = serverURL + '/api/flutterwavecancel';
                await axios.post(postURL, dataToSends).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
      } else {
                const postURL = serverURL + '/api/razorpaycancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            }
        } catch (error) {
            cancelSubscription();
        }
    }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'stripe':
        return <FiCreditCard className="text-blue-600 dark:text-blue-400" />;
      case 'paypal':
        return <FiDollarSign className="text-blue-600 dark:text-blue-400" />;
      case 'paystack':
        return <FiCreditCard className="text-green-600 dark:text-green-400" />;
      case 'flutterwave':
        return <FiCreditCard className="text-orange-600 dark:text-orange-400" />;
      default:
        return <FiCreditCard className="text-purple-600 dark:text-purple-400" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === 'active' || status === 'ACTIVE') {
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    }
    return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
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
            <p className="text-gray-600 dark:text-gray-300">Loading subscription details...</p>
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
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Subscription Management
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Manage your subscription plan and billing information
            </p>
          </motion.div>

          {/* Current Plan Overview */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiShield className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  {getPaymentMethodIcon(method)}
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Payment Method</div>
                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                      {method || 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Plan Type</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {sessionStorage.getItem('type') || 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(jsonData.status)}`}>
                      Active
                    </span>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription Details */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiUser className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Subscription Details
                </h2>
              </div>

              {method === 'flutterwave' ? (
                <SubscriptionDetailsFlutterwave jsonData={jsonData} method={method} plan={sessionStorage.getItem('plan')} />
              ) : method === 'stripe' ? (
                <SubscriptionDetailsStripe jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />
              ) : method === 'paystack' ? (
                <SubscriptionDetailsPayStack jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />
              ) : method === 'paypal' ? (
                <SubscriptionDetails jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />
              ) : (
                <SubscriptionDetailsRazorpay jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.button
              onClick={modifySubscription}
              disabled={processing2}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {processing2 ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiRefreshCw />
                  Modify Subscription
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => setShowCancelModal(true)}
              disabled={processing}
              className="flex items-center justify-center gap-2 py-3 px-6 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-all disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {processing ? (
                <>
                  <FiLoader className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <FiX />
                  Cancel Subscription
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Information Card */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800 dark:text-blue-300">
                <h3 className="font-medium mb-2">Important Information</h3>
                <ul className="text-sm space-y-1 list-disc list-inside ml-1">
                  <li>Plan modifications are only available for PayPal subscriptions</li>
                  <li>Cancellation will take effect at the end of your current billing period</li>
                  <li>You'll retain access to premium features until your subscription expires</li>
                  <li>Contact support if you need assistance with your subscription</li>
                </ul>
                </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Cancel Subscription
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      cancelSubscription();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <FiX size={16} />
                    Cancel Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Manage;
