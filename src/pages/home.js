import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footers from '../components/footers';
import UserCourses from '../components/usercourses';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('mName') || 'User';
  
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
  
  const handleCreateCourse = () => {
    navigate('/create');
  };

    return (
    <div className='min-h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
      
      <main className='flex-1 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black'>
        <section className='relative'>
          <motion.div 
            className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{userName}</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Here are all your courses. Continue learning or create a new one.
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={handleCreateCourse}
                  className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus className="text-lg" />
                  Create New Course
                </motion.button>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 rounded-xl p-6 shadow-sm"
              variants={itemVariants}
            >
              <UserCourses userId={sessionStorage.getItem('uid')} />
            </motion.div>
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

export default Home;
