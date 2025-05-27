import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { name, serverURL, websiteURL } from '../constants';
import DarkModeToggle from './DarkModeToggle';
import LogoComponent from './LogoComponent';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import { HiOutlineMenu, HiX, HiChevronDown } from 'react-icons/hi';

const Header = ({ isHome }) => {
  const storedTheme = sessionStorage.getItem('darkMode');
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if user is scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle admin status and authentication
  useEffect(() => {
    if (isHome && sessionStorage.getItem('uid') === null) {
      navigate("/signin");
    }
    
    async function dashboardData() {
      try {
      const postURL = serverURL + `/api/dashboard`;
      const response = await axios.post(postURL);
      sessionStorage.setItem('adminEmail', response.data.admin.email);
      if (response.data.admin.email === sessionStorage.getItem('email')) {
          setAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    
    if (sessionStorage.getItem('adminEmail')) {
      if (sessionStorage.getItem('adminEmail') === sessionStorage.getItem('email')) {
        setAdmin(true);
      }
    } else {
      dashboardData();
    }
  }, [isHome, navigate]);

  // Navigation functions
  const redirectSignIn = () => navigate("/signin");
  const redirectAdmin = () => {
    sessionStorage.setItem('darkMode', false);
    window.location.href = websiteURL + '/dashboard';
  };
  const redirectFeatures = () => navigate("/features");
  const redirectSignUp = () => navigate("/signup");
  const redirectHome = () => navigate("/home");
  const redirectGenerate = () => navigate("/create");
  const redirectProfile = () => navigate("/profile");
  const redirectPricing = () => navigate('/pricing', { state: { header: true } });
  const redirectPricingTwo = () => navigate('/pricing', { state: { header: false } });
  
  const Logout = () => {
    sessionStorage.clear();
    showToast('Logout Successful');
    redirectSignIn();
  };

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

  // Animation variants
  const navbarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  const isActive = (path) => {
    return location.pathname === path ? true : false;
  };

  // Nav link component with active state
  const NavLink = ({ children, onClick, path, isPrimary = false }) => {
    const active = path ? isActive(path) : false;
    
    return (
      <motion.button
        onClick={onClick}
        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isPrimary 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-900/30' 
            : active
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {active && !isPrimary && (
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 dark:bg-blue-400"
            layoutId="activeIndicator"
          />
        )}
      </motion.button>
    );
  };

  return (
    <motion.header 
      initial="initial"
      animate="animate"
      variants={navbarVariants}
      className={`sticky top-0 w-full z-50 transition-all ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <motion.a 
              href={websiteURL}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogoComponent isDarkMode={storedTheme} />
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {name}
              </span>
            </motion.a>
            </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {!isHome ? (
              <>
                <NavLink onClick={redirectPricingTwo} path="/pricing">Pricing</NavLink>
                <NavLink onClick={redirectFeatures} path="/features">Features</NavLink>
                <div className="ml-2 flex items-center space-x-2">
                <DarkModeToggle />
                  <NavLink onClick={redirectSignIn} path="/signin">Sign In</NavLink>
                  <NavLink onClick={redirectSignUp} path="/signup" isPrimary>Sign Up</NavLink>
              </div>
              </>
            ) : (
              <>
                <NavLink onClick={redirectHome} path="/home">Home</NavLink>
                <NavLink onClick={redirectProfile} path="/profile">Profile</NavLink>
                <NavLink onClick={redirectPricing} path="/pricing">Pricing</NavLink>
                {admin && <NavLink onClick={redirectAdmin}>Admin</NavLink>}
                <NavLink onClick={Logout}>Logout</NavLink>
                <div className="ml-2 flex items-center space-x-2">
                  <DarkModeToggle />
                  <NavLink onClick={redirectGenerate} isPrimary>
                    Generate Course
                  </NavLink>
                </div>
              </>
            )}
            </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
                <DarkModeToggle />
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiOutlineMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
              </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 border-t dark:border-gray-800">
              {!isHome ? (
                <>
                  <MobileNavLink onClick={redirectPricingTwo}>Pricing</MobileNavLink>
                  <MobileNavLink onClick={redirectFeatures}>Features</MobileNavLink>
                  <MobileNavLink onClick={redirectSignIn}>Sign In</MobileNavLink>
                  <MobileNavLink onClick={redirectSignUp} isPrimary>Sign Up</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink onClick={redirectHome}>Home</MobileNavLink>
                  <MobileNavLink onClick={redirectProfile}>Profile</MobileNavLink>
                  <MobileNavLink onClick={redirectPricing}>Pricing</MobileNavLink>
                  {admin && <MobileNavLink onClick={redirectAdmin}>Admin</MobileNavLink>}
                  <MobileNavLink onClick={Logout}>Logout</MobileNavLink>
                  <MobileNavLink onClick={redirectGenerate} isPrimary>Generate Course</MobileNavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ children, onClick, isPrimary = false }) => (
  <motion.button
    onClick={onClick}
    className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium ${
      isPrimary 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
        : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
  );

export default Header;