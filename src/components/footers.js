import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../res/img/logo.svg';
import DarkLogo from '../res/img/darkLogo.svg';
import { company, websiteURL, name } from '../constants';
import { useNavigate } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

const Footers = () => {
  const storedTheme = sessionStorage.getItem('darkMode');
  const navigate = useNavigate();
  
  // Navigation functions
  const redirectAbout = () => navigate("/about");
  const redirectContact = () => navigate("/contact");
  const redirectTerms = () => navigate("/terms");
  const redirectPrivacy = () => navigate("/privacy");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Link components with hover animation
  const FooterLink = ({ children, onClick }) => (
    <motion.button
      onClick={onClick}
      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
  
  // Social media link
  const SocialLink = ({ icon, href, label }) => (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-gray-900 pt-12 pb-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          {/* Brand section */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
            <motion.a
            href={websiteURL}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <img
            src={storedTheme === "true" ? DarkLogo : Logo}
                alt={`${name} Logo`}
                className="h-8 w-auto"
          />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {name}
              </span>
            </motion.a>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Create AI-powered courses on any topic with just a few clicks. Learn, grow, and share knowledge.
            </p>
            <div className="mt-4 flex space-x-4">
              <SocialLink 
                icon={<FiTwitter size={20} />} 
                href={websiteURL} 
                label="Twitter" 
              />
              <SocialLink 
                icon={<FiGithub size={20} />} 
                href={websiteURL} 
                label="GitHub"
              />
              <SocialLink 
                icon={<FiLinkedin size={20} />} 
                href={websiteURL} 
                label="LinkedIn"
              />
              <SocialLink 
                icon={<FiInstagram size={20} />} 
                href={websiteURL} 
                label="Instagram"
              />
            </div>
          </motion.div>
          
          {/* Quick links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <div className="mt-4 space-y-3">
              <div><FooterLink onClick={redirectAbout}>About Us</FooterLink></div>
              <div><FooterLink onClick={redirectContact}>Contact</FooterLink></div>
              <div><FooterLink onClick={() => navigate("/features")}>Features</FooterLink></div>
              <div><FooterLink onClick={() => navigate("/pricing")}>Pricing</FooterLink></div>
            </div>
          </motion.div>
          
          {/* Legal links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <div className="mt-4 space-y-3">
              <div><FooterLink onClick={redirectTerms}>Terms of Service</FooterLink></div>
              <div><FooterLink onClick={redirectPrivacy}>Privacy Policy</FooterLink></div>
              <div><FooterLink onClick={() => navigate("/cancellation")}>Cancellation Policy</FooterLink></div>
              <div><FooterLink onClick={() => navigate("/refund")}>Refund Policy</FooterLink></div>
            </div>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Get the latest updates on new features and releases.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <motion.button
                className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} {company}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 md:mt-0">
              Made with ❤️ for the learning community
            </p>
        </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footers;
