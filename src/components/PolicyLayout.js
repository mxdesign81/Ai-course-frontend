import React from 'react';
import { motion } from 'framer-motion';
import Header from './header';
import Footers from './footers';
import StyledText from './styledText';
import { FiFileText, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/policy.css';

const PolicyLayout = ({ title, content, isLoading = false }) => {
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
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header isHome={false} className="sticky top-0 z-50" />
      
      <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
        <section className='relative overflow-hidden'>
          <motion.div 
            className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.button
              onClick={handleBack}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
              variants={itemVariants}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="mr-2" />
              Back
            </motion.button>
            
            <div className="flex items-center mb-8">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full flex items-center justify-center mr-4"
                variants={itemVariants}
              >
                <FiFileText className="text-blue-600 dark:text-blue-400 text-xl" />
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                variants={itemVariants}
              >
                {title}
              </motion.h1>
            </div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 lg:p-10"
              variants={itemVariants}
            >
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-pulse flex flex-col space-y-4 w-full">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              ) : (
                <div className="policy-content prose prose-blue max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h2:text-blue-600 dark:prose-h2:text-blue-400 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                  <StyledText text={content} />
                </div>
              )}
            </motion.div>
            
            {/* Last updated note */}
            <motion.p 
              className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-right"
              variants={itemVariants}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-20 right-10 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
          
          <motion.div 
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-purple-400/5 dark:bg-purple-500/5"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 9, delay: 1 }}
          />
        </section>
      </main>
      
      <Footers className="sticky bottom-0 z-50" />
    </div>
  );
};

export default PolicyLayout; 