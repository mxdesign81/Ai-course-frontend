import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import countryList from 'react-select-country-list';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { 
  FiCreditCard, FiUser, FiMail, FiMapPin, FiGlobe, 
  FiLock, FiShield, FiLoader, FiCheck, FiDollarSign,
  FiArrowRight, FiInfo
} from 'react-icons/fi';
import { 
  SiPaypal, SiStripe, SiRazorpay 
} from 'react-icons/si';

import Header from '../components/header';
import Footers from '../components/footers';
import { 
  amountInZarOne, amountInZarTwo, flutterwaveEnabled, flutterwavePlanIdOne, 
  flutterwavePlanIdTwo, flutterwavePublicKey, logo, MonthCost, name, 
  paypalEnabled, paypalPlanIdOne, paypalPlanIdTwo, paystackEnabled, 
  paystackPlanIdOne, paystackPlanIdTwo, razorpayEnabled, razorpayPlanIdOne, 
  razorpayPlanIdTwo, serverURL, stripeEnabled, stripePlanIdOne, 
  stripePlanIdTwo, YearCost 
} from '../constants';

const Payment = () => {
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [address, setAddress] = useState('');
    const [mName, setName] = useState(sessionStorage.getItem('mName'));
    const [lastName, setLastName] = useState('');
    const [post, setPost] = useState('');
    const [country, setCountry] = useState('');
    const [admin, setAdmin] = useState('');
  const [processing, setProcessing] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const options = useMemo(() => countryList().getData(), []);
    const { state } = useLocation();
    const { plan } = state || {};
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

    useEffect(() => {
        if (!plan) {
            navigate("/pricing");
        }
    }, []);

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

  const validateForm = () => {
        if (!email || !mName || !lastName || !post || !address || !country || !admin) {
            showToast('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const startPaystack = async () => {
    if (!validateForm()) return;
    setProcessing('paystack');
    
        let planId = paystackPlanIdTwo;
        let amountInZar = amountInZarTwo;
        if (plan === 'Monthly Plan') {
            planId = paystackPlanIdOne;
            amountInZar = amountInZarOne;
        }
    
    try {
      const response = await axios.post(`${serverURL}/api/paystackpayment`, {
        planId,
            amountInZar,
        email
      });
      
      sessionStorage.setItem('paystack', response.data.id);
            sessionStorage.setItem('method', 'paystack');
            sessionStorage.setItem('plan', plan);
      setProcessing('');
      window.location.href = response.data.url;
        } catch (error) {
      setProcessing('');
      showToast('Payment initialization failed. Please try again.');
    }
  };

  const startStripe = async () => {
    if (!validateForm()) return;
    setProcessing('stripe');
    
        let planId = stripePlanIdTwo;
        if (plan === 'Monthly Plan') {
            planId = stripePlanIdOne;
        }
    
        try {
      const response = await axios.post(`${serverURL}/api/stripepayment`, { planId });
      
      sessionStorage.setItem('stripe', response.data.id);
            sessionStorage.setItem('method', 'stripe');
            sessionStorage.setItem('plan', plan);
      setProcessing('');
      window.location.href = response.data.url;
    } catch (error) {
      setProcessing('');
      showToast('Payment initialization failed. Please try again.');
    }
  };

  const startRazorpay = async () => {
    if (!validateForm()) return;
    setProcessing('razorpay');
    
    const fullAddress = `${address} ${admin} ${post} ${country}`;
    let planId = razorpayPlanIdTwo;
    if (plan === 'Monthly Plan') {
      planId = razorpayPlanIdOne;
    }
    
    try {
      const response = await axios.post(`${serverURL}/api/razorpaycreate`, {
        plan: planId,
        email,
        fullAddress
      });
      
      sessionStorage.setItem('method', 'razorpay');
      sessionStorage.setItem('plan', plan);
      setProcessing('');
      window.open(response.data.short_url, '_blank');
      navigate('/pending', { state: { sub: response.data.id, link: response.data.short_url } });
        } catch (error) {
      setProcessing('');
      showToast('Payment initialization failed. Please try again.');
    }
  };

  const startPayPal = async () => {
    if (!validateForm()) return;
    setProcessing('paypal');
    
    let planId = paypalPlanIdTwo;
    if (plan === 'Monthly Plan') {
      planId = paypalPlanIdOne;
    }
    
    try {
      const response = await axios.post(`${serverURL}/api/paypal`, {
        planId,
        email,
        name: mName,
        lastName,
        post,
        address,
        country,
        brand: name,
        admin
      });
      
      sessionStorage.setItem('method', 'paypal');
      sessionStorage.setItem('plan', plan);
      setProcessing('');
      
      const approveLink = response.data.links.find(link => link.rel === "approve");
      if (approveLink) {
        window.location.href = approveLink.href;
      }
    } catch (error) {
      setProcessing('');
      showToast('Payment initialization failed. Please try again.');
    }
  };

    const config = {
        public_key: flutterwavePublicKey,
        tx_ref: Date.now(),
        currency: 'USD',
        amount: plan === 'Monthly Plan' ? MonthCost : YearCost,
        payment_options: "card",
        payment_plan: plan === 'Monthly Plan' ? flutterwavePlanIdOne : flutterwavePlanIdTwo,
    customer: { email, name: mName },
        customizations: {
            title: name,
            description: 'Subscription Payment',
      logo,
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <SiStripe className="w-6 h-6" />,
      description: 'Credit/Debit Card',
      enabled: stripeEnabled,
      action: startStripe,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <SiPaypal className="w-6 h-6" />,
      description: 'PayPal Account',
      enabled: paypalEnabled,
      action: startPayPal,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: <SiRazorpay className="w-6 h-6" />,
      description: 'UPI, Cards, Net Banking',
      enabled: razorpayEnabled,
      action: startRazorpay,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'paystack',
      name: 'Paystack',
      icon: <FiCreditCard className="w-6 h-6" />,
      description: 'Cards & Bank Transfer',
      enabled: paystackEnabled,
      action: startPaystack,
      color: 'from-green-600 to-teal-600'
    }
  ];

  const enabledMethods = paymentMethods.filter(method => method.enabled);

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
              Complete Your Payment
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Secure checkout for your {plan} subscription
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Information */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <FiUser className="text-blue-600 dark:text-blue-400" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Billing Information
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={mName}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter first name"
                        />
                                </div>
                            </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter last name"
                        />
                                </div>
                            </div>
                                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter email address"
                      />
                            </div>
                                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter street address"
                      />
                            </div>
                                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={admin}
                        onChange={(e) => setAdmin(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="City"
                      />
                            </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Postal code"
                      />
                                </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select country</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                                        </option>
                                    ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <FiCreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {enabledMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={method.action}
                      disabled={processing === method.id}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${processing === method.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                      whileHover={{ scale: processing === method.id ? 1 : 1.02 }}
                      whileTap={{ scale: processing === method.id ? 1 : 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white`}>
                            {method.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {method.description}
                            </div>
                          </div>
                        </div>
                        {processing === method.id ? (
                          <FiLoader className="animate-spin text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FiArrowRight className="text-gray-400" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FiShield className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-green-800 dark:text-green-300">
                      <h3 className="font-medium mb-1">Secure Payment</h3>
                      <p className="text-sm">
                        Your payment information is encrypted and secure. We never store your payment details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiDollarSign className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {plan}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI Course Platform Subscription
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${plan === 'Monthly Plan' ? MonthCost : YearCost}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {plan === 'Monthly Plan' ? 'per month' : 'per year'}
                  </div>
                </div>
                </div>
            </div>
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

export default Payment;
