import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiXCircle, FiEdit3, FiSave, FiRefreshCw,
  FiFileText, FiEye, FiSettings
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import CancellationEdit from './components/cancellationedit';

const Cancellation = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        sessionStorage.setItem('darkMode', false);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
            {/* Mobile Layout */}
            <div className="md:hidden">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black opacity-50 z-50"
                            onClick={toggleSidebar}
                        />
                    )}
                </AnimatePresence>
                
                <div className="flex flex-col">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
                    >
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 flex items-center">
                                <FiXCircle className="w-5 h-5 mr-2 text-red-600" />
                                Cancellation Policy Editor
                            </h1>
                            <motion.button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                            </motion.button>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        className="p-4 pb-20"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <CancellationEdit />
                        </motion.div>
                    </motion.div>
                    
                    <AdminSidebarMobile isSidebarOpen={isSidebarOpen} />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex h-screen">
                <AdminSidebar />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 flex items-center">
                                    <FiXCircle className="w-6 h-6 mr-3 text-red-600" />
                                    Cancellation Policy Editor
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage and update your cancellation policy content
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiFileText size={16} />
                                    Policy Management
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <motion.div variants={itemVariants}>
                                <CancellationEdit />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cancellation;
