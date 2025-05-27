import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoComponent from '../../components/LogoComponent';
import { 
  MdSpaceDashboard, MdSettingsInputComponent 
} from "react-icons/md";
import { 
  FaUsers, FaDollarSign 
} from "react-icons/fa";
import { 
  PiVideoFill 
} from "react-icons/pi";
import { 
  AiFillMessage 
} from "react-icons/ai";
import { 
  FiFileText, FiShield, FiXCircle, FiRotateCcw, FiCreditCard,
  FiChevronRight, FiSettings, FiLogOut
} from "react-icons/fi";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Navigation functions
    const redirectDashBoard = () => navigate("/dashBoard");
    const redirectUsers = () => navigate("/users");
    const redirectCourses = () => navigate("/courses");
    const redirectPaid = () => navigate("/paid");
    const redirectContacts = () => navigate("/contacts");
    const redirectAdmins = () => navigate("/admins");
    const redirectTerms = () => navigate("/editterms");
    const redirectRefund = () => navigate("/editrefund");
    const redirectPrivacy = () => navigate("/editprivacy");
    const redirectBilling = () => navigate("/editbilling");
    const redirectCancel = () => navigate("/editcancellation");

    // Menu items configuration
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: MdSpaceDashboard,
            onClick: redirectDashBoard,
            path: '/dashBoard',
            color: 'blue'
        },
        {
            id: 'users',
            label: 'Users',
            icon: FaUsers,
            onClick: redirectUsers,
            path: '/users',
            color: 'green'
        },
        {
            id: 'courses',
            label: 'Courses',
            icon: PiVideoFill,
            onClick: redirectCourses,
            path: '/courses',
            color: 'purple'
        },
        {
            id: 'paid',
            label: 'Paid Users',
            icon: FaDollarSign,
            onClick: redirectPaid,
            path: '/paid',
            color: 'yellow'
        },
        {
            id: 'admins',
            label: 'Admins',
            icon: MdSettingsInputComponent,
            onClick: redirectAdmins,
            path: '/admins',
            color: 'red'
        },
        {
            id: 'contacts',
            label: 'Contacts',
            icon: AiFillMessage,
            onClick: redirectContacts,
            path: '/contacts',
            color: 'indigo'
        }
    ];

    const policyItems = [
        {
            id: 'terms',
            label: 'Terms',
            icon: FiFileText,
            onClick: redirectTerms,
            path: '/editterms',
            color: 'gray'
        },
        {
            id: 'privacy',
            label: 'Privacy',
            icon: FiShield,
            onClick: redirectPrivacy,
            path: '/editprivacy',
            color: 'blue'
        },
        {
            id: 'cancellation',
            label: 'Cancellation',
            icon: FiXCircle,
            onClick: redirectCancel,
            path: '/editcancellation',
            color: 'red'
        },
        {
            id: 'refund',
            label: 'Refund',
            icon: FiRotateCcw,
            onClick: redirectRefund,
            path: '/editrefund',
            color: 'green'
        },
        {
            id: 'billing',
            label: 'Subscription & Billing',
            icon: FiCreditCard,
            onClick: redirectBilling,
            path: '/editbilling',
            color: 'purple'
        }
    ];

    // Check if current path matches menu item
    const isActive = (path) => location.pathname === path;

    // Get color classes for different states
    const getColorClasses = (color, isActive, isHovered) => {
        const colors = {
            blue: {
                bg: isActive ? 'bg-blue-100 dark:bg-blue-900/30' : isHovered ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                text: isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-blue-500' : 'border-transparent'
            },
            green: {
                bg: isActive ? 'bg-green-100 dark:bg-green-900/30' : isHovered ? 'bg-green-50 dark:bg-green-900/20' : '',
                text: isActive ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-green-500' : 'border-transparent'
            },
            purple: {
                bg: isActive ? 'bg-purple-100 dark:bg-purple-900/30' : isHovered ? 'bg-purple-50 dark:bg-purple-900/20' : '',
                text: isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-purple-500' : 'border-transparent'
            },
            yellow: {
                bg: isActive ? 'bg-yellow-100 dark:bg-yellow-900/30' : isHovered ? 'bg-yellow-50 dark:bg-yellow-900/20' : '',
                text: isActive ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-yellow-500' : 'border-transparent'
            },
            red: {
                bg: isActive ? 'bg-red-100 dark:bg-red-900/30' : isHovered ? 'bg-red-50 dark:bg-red-900/20' : '',
                text: isActive ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-red-500' : 'border-transparent'
            },
            indigo: {
                bg: isActive ? 'bg-indigo-100 dark:bg-indigo-900/30' : isHovered ? 'bg-indigo-50 dark:bg-indigo-900/20' : '',
                text: isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-indigo-500' : 'border-transparent'
            },
            gray: {
                bg: isActive ? 'bg-gray-100 dark:bg-gray-700' : isHovered ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                text: isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                icon: isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400',
                border: isActive ? 'border-gray-500' : 'border-transparent'
            }
        };
        return colors[color] || colors.gray;
    };

    // Menu item component
    const MenuItem = React.memo(({ item, index }) => {
        const active = isActive(item.path);
        const hovered = hoveredItem === item.id;
        const colors = getColorClasses(item.color, active, hovered);

        return (
            <motion.div
                initial={hasAnimated ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hasAnimated ? 0 : index * 0.1 }}
                className="relative"
                layout={false}
                onAnimationComplete={() => {
                    if (index === 0 && !hasAnimated) {
                        setHasAnimated(true);
                    }
                }}
            >
                <motion.button
                    onClick={item.onClick}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${colors.bg} ${colors.border} group`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout={false}
                >
                    <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${colors.icon} transition-colors duration-200`} />
                        <span className={`font-medium ${colors.text} transition-colors duration-200`}>
                            {item.label}
                        </span>
                    </div>
                    
                    {active && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                            layout={false}
                        />
                    )}
                    
                    {hovered && !active && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            layout={false}
                        >
                            <FiChevronRight className={`w-4 h-4 ${colors.icon}`} />
                        </motion.div>
                    )}
                </motion.button>
            </motion.div>
        );
    });

    return (
        <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <LogoComponent isDarkMode={false} />
                </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {/* Main Navigation */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                        Main Navigation
                    </h3>
                    <div className="space-y-2">
                        {menuItems.map((item, index) => (
                            <MenuItem key={item.id} item={item} index={index} />
                        ))}
                </div>
                </div>

                {/* Policy Management */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
                        Policy Management
                    </h3>
                    <div className="space-y-2">
                        {policyItems.map((item, index) => (
                            <MenuItem key={item.id} item={item} index={index + menuItems.length} />
                        ))}
                </div>
                </div>
                </div>

            {/* Footer Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Admin Panel</span>
                    <FiSettings className="w-4 h-4" />
                </div>
                </div>
                </div>
    );
};

export default AdminSidebar;
