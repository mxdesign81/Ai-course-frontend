import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiMail, FiUser, FiMessageSquare, FiPhone,
  FiSearch, FiRefreshCw, FiEye, FiDownload, FiFilter
} from 'react-icons/fi';
import AdminSidebar from './components/adminsidebar';
import AdminHead from './components/adminhead';
import AdminSidebarMobile from './components/adminsidebarmobile';
import { serverURL } from '../constants';
import axios from 'axios';

const Contacts = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

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

    useEffect(() => {
        sessionStorage.setItem('darkMode', false);
        fetchContactData();
    }, []);

    const fetchContactData = async () => {
        try {
            setIsLoading(true);
            const postURL = serverURL + `/api/getcontact`;
            const response = await axios.get(postURL);
            setData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching contact data:', error);
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchContactData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const filteredContacts = data.filter(contact =>
        contact.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.msg.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ContactCard = ({ contact, index }) => (
        <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {contact.fname.charAt(0).toUpperCase()}{contact.lname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {contact.fname} {contact.lname}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <FiMail className="w-4 h-4" />
                            <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <FiPhone className="w-4 h-4" />
                                <span>{contact.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <motion.button
                    onClick={() => setSelectedContact(contact)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiEye className="w-4 h-4" />
                </motion.button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <FiMessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {contact.msg}
                </p>
            </div>
        </motion.div>
    );

    const ContactTableRow = ({ contact, index }) => (
        <motion.tr
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {contact.fname.charAt(0).toUpperCase()}{contact.lname.charAt(0).toUpperCase()}
                    </div>
            <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                            {contact.fname} {contact.lname}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <FiPhone className="w-4 h-4" />
                            <span>{contact.phone}</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="max-w-xs">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {contact.msg}
                    </p>
                </div>
            </td>
            <td className="px-6 py-4">
                <motion.button
                    onClick={() => setSelectedContact(contact)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FiEye className="w-4 h-4" />
                    <span>View</span>
                </motion.button>
            </td>
        </motion.tr>
    );

    // Contact Detail Modal
    const ContactModal = () => (
        <AnimatePresence>
            {selectedContact && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedContact(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Contact Details
                                </h2>
                                <motion.button
                                    onClick={() => setSelectedContact(null)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiX className="w-5 h-5 text-gray-500" />
                                </motion.button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                                        {selectedContact.fname.charAt(0).toUpperCase()}{selectedContact.lname.charAt(0).toUpperCase()}
                                    </div>
                        <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedContact.fname} {selectedContact.lname}
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <FiMail className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Email</span>
                                        </div>
                                        <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                                    </div>
                                    
                                    {selectedContact.phone && (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FiPhone className="w-5 h-5 text-green-500" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Phone</span>
                                            </div>
                                            <p className="text-gray-900 dark:text-white">{selectedContact.phone}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <FiMessageSquare className="w-5 h-5 text-purple-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Message</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                        {selectedContact.msg}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-300">Loading contact messages...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                Contact Messages
                            </h1>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                </motion.button>
                                <motion.button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        className="p-4 pb-20"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Search Bar */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </motion.div>

                        {/* Contact Cards */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            {filteredContacts.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No contact messages found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'Try adjusting your search criteria' : 'No messages have been received yet'}
                                    </p>
                                </div>
                            ) : (
                                filteredContacts.map((contact, index) => (
                                    <ContactCard key={contact._id} contact={contact} index={index} />
                                ))
                            )}
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
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Contact Messages
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage and respond to customer inquiries
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiMail size={16} />
                                    {filteredContacts.length} messages
                                </div>
                                <motion.button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </motion.button>
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
                            {/* Search Bar */}
                            <motion.div variants={itemVariants}>
                                <div className="relative max-w-md">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search contacts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </motion.div>

                            {/* Contact Table */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Contact Info
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Message
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <motion.tbody
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="divide-y divide-gray-200 dark:divide-gray-700"
                                        >
                                            {filteredContacts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-12">
                                                        <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                            No contact messages found
                                                        </h3>
                                                        <p className="text-gray-500 dark:text-gray-400">
                                                            {searchTerm ? 'Try adjusting your search criteria' : 'No messages have been received yet'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredContacts.map((contact, index) => (
                                                    <ContactTableRow key={contact._id} contact={contact} index={index} />
                                                ))
                                            )}
                                        </motion.tbody>
                                    </table>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Contact Detail Modal */}
            <ContactModal />
        </div>
    );
};

export default Contacts;