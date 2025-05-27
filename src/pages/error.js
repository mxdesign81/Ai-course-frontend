import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import Logo from '../res/img/errorday.gif';
import LogoNight from '../res/img/errornight.gif';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const Error = () => {
  const navigate = useNavigate();
  const isDarkMode = sessionStorage.getItem('darkMode') === 'true';

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
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

    return (
    <div className='min-h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
      
      <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
        <motion.div 
          className="flex flex-col items-center justify-center h-full px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="relative"
            variants={itemVariants}
            animate={{ 
              y: [0, -10, 0],
              transition: { repeat: Infinity, duration: 3 }
            }}
          >
            <div className="absolute -inset-4 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-xl"></div>
            <img 
              alt='Error illustration' 
              src={isDarkMode ? LogoNight : Logo} 
              className="relative mb-8 h-80 w-80 max-md:h-64 max-md:w-64 z-10" 
            />
          </motion.div>
          
          <motion.div 
            className="mb-8 flex items-center justify-center"
            variants={itemVariants}
          >
            <FiAlertCircle className="mr-2 text-2xl text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Oops! Something Went Wrong
            </h1>
          </motion.div>
          
          <motion.p 
            className="max-w-md text-lg text-gray-700 dark:text-gray-300 mb-8"
            variants={itemVariants}
          >
            The page you're looking for may have been moved, deleted, or never existed in the first place.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHome className="text-lg" />
              Go Home
            </motion.button>
            
            <motion.button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 py-3 px-8 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
      
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Error;
