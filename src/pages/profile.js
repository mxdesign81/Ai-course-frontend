import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePWAInstall } from 'react-use-pwa-install';
import { 
  FiUser, FiMail, FiLock, FiSave, FiSettings, 
  FiDownload, FiTrash2, FiAlertTriangle, FiLoader,
  FiShield, FiSmartphone
} from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';

const Profile = () => {
  const install = usePWAInstall();
    const [mName, setName] = useState(sessionStorage.getItem('mName'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    function redirectSubscription() {
        navigate("/subscription");
    }

    async function deleteProfile() {
        if (sessionStorage.getItem('adminEmail') === sessionStorage.getItem('email')) {
            showToast("Admin profile cannot be deleted");
        } else {
      setShowDeleteModal(true);
        }
    }

    function redirectLogin() {
        sessionStorage.clear();
        navigate("/signin");
    }

    async function startDeletion() {
        setProcessingDelete(true);
        const uid = sessionStorage.getItem('uid');
        const postURL = serverURL + '/api/deleteuser';
        try {
            const response = await axios.post(postURL, { userId: uid });
            if (response.data.success) {
                showToast(response.data.message);
                setProcessingDelete(false);
        setShowDeleteModal(false);
                redirectLogin();
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    }

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
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !mName) {
            showToast('Please fill in all required fields');
            return;
        }
        setProcessing(true);
        const uid = sessionStorage.getItem('uid');
        const postURL = serverURL + '/api/profile';
        try {
            const response = await axios.post(postURL, { email, mName, password, uid });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('mName', mName);
        setProcessing(false);
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    }

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
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Profile Settings
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Manage your account information and preferences
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <FiUser className="text-blue-600 dark:text-blue-400" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h2>
                                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiUser className="text-gray-400 dark:text-gray-500" size={16} />
                            </div>
                        <input
                          id="name"
                          type="text"
                          value={mName}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                                </div>
                            </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMail className="text-gray-400 dark:text-gray-500" size={16} />
                            </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiLock className="text-gray-400 dark:text-gray-500" size={16} />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                        </div>

                  <motion.button
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all disabled:opacity-70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {processing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Account Actions Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                <FiSettings className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Actions
                </h2>
              </div>

              <div className="space-y-4">
                {sessionStorage.getItem('type') !== 'forever' && (
                  <motion.button
                    onClick={redirectSubscription}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <FiShield className="text-blue-600 dark:text-blue-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Manage Subscription
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          View and modify your subscription plan
                        </div>
                      </div>
                    </div>
                    <FiSettings className="text-gray-400" />
                  </motion.button>
                )}

                {install && (
                  <motion.button
                    onClick={install}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <FiSmartphone className="text-green-600 dark:text-green-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Install Desktop App
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Get the native app experience
                        </div>
                      </div>
                    </div>
                    <FiDownload className="text-gray-400" />
                  </motion.button>
                )}

                <motion.button
                  onClick={deleteProfile}
                  className="w-full flex items-center justify-between p-4 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <FiTrash2 className="text-red-600 dark:text-red-400" />
                    <div className="text-left">
                      <div className="font-medium text-red-900 dark:text-red-100">
                        Delete Account
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        Permanently remove your account and data
                        </div>
                    </div>
                  </div>
                  <FiAlertTriangle className="text-red-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
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
                  Delete Account
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startDeletion}
                    disabled={processingDelete}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-70"
                  >
                    {processingDelete ? (
                      <>
                        <FiLoader className="animate-spin" size={16} />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FiTrash2 size={16} />
                        Delete
                      </>
                    )}
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

export default Profile;
