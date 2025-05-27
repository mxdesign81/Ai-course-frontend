import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toPng } from 'html-to-image';
import { FiDownload, FiAward, FiShare2, FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';

import Header from '../components/header';
import Footers from '../components/footers';
import ShareOnSocial from 'react-share-on-social';
import certificateFrame from '../res/img/certificate.png';
import logo from '../res/img/logo.svg';
import { name, websiteURL } from '../constants';

const Certificate = () => {
    const [processing, setProcessing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
    const userName = sessionStorage.getItem('mName');
    const { state } = useLocation();
    const navigate = useNavigate();
    const { courseTitle, end } = state || {};

    const pdfRef = useRef(null);
  const courseId = sessionStorage.getItem('courseId');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, type: "spring", stiffness: 200 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    if (!courseTitle) {
      navigate("/create");
      return;
    }

    // Launch confetti on component mount
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    
    const confettiAnimation = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#FFC700', '#FF0058', '#2BD1FC', '#FF3860', '#04CFDE'],
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.9, 1.1)
      });
      
      requestAnimationFrame(confettiAnimation);
    };
    
    requestAnimationFrame(confettiAnimation);
  }, [courseTitle, navigate]);

    const handleDownload = async () => {
        setProcessing(true);
    try {
      if (pdfRef.current) {
        const dataUrl = await toPng(pdfRef.current, { 
          cacheBust: false,
          pixelRatio: 2,
          quality: 1,
          width: pdfRef.current.offsetWidth,
          height: pdfRef.current.offsetHeight,
          style: {
            margin: 0,
            padding: 0
          }
        });
        
                const link = document.createElement("a");
        link.download = `${courseTitle}-certificate.png`;
                link.href = dataUrl;
                link.click();
        showToast("Certificate downloaded successfully!");
      }
    } catch (err) {
      console.error("Error generating certificate image:", err);
      showToast("Failed to download certificate. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

    useEffect(() => {
        if (!courseTitle) {
            navigate("/create");
        }
  }, [courseTitle, navigate]);

    function isValidFormat(dateString) {
        // Regex to check if date is in M/D/YY format
        const regex = /^([1-9]|1[0-2])\/([1-9]|[1-2][0-9]|3[0-1])\/\d{2}$/;
        return regex.test(dateString);
    }

    function formatDateToMDYY(date) {
        // Create a Date object from the ISO string
        const dateObj = new Date(date);

        // Handle invalid date scenarios
        if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date");
        }

        // Format the date to M/D/YY
        const month = dateObj.getMonth() + 1; // No leading zero
        const day = dateObj.getDate();
        const year = dateObj.getFullYear().toString().slice(-2); // Last two digits of the year

        return `${month}/${day}/${year}`;
    }

    function checkAndFormatDate(dateString) {
        if (isValidFormat(dateString)) {
            return dateString; // Already in M/D/YY format
        } else {
            // Assume input is in ISO 8601 format if not already valid
            return formatDateToMDYY(dateString);
        }
    }

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

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
            <Header isHome={true} className="sticky top-0 z-50" />
      
      <main className="flex-1 flex flex-col">
        <motion.div 
          className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Congratulations!
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{userName}</span>, you've successfully completed the course <span className="font-semibold">{courseTitle}</span>!
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-4xl mx-auto mb-12 flex flex-col items-center relative"
          >
            <div 
              ref={pdfRef}
              className="relative w-full"
            >
              <img 
                src={certificateFrame} 
                alt="Certificate" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute text-3xl font-black italic max-lg:text-2xl max-md:text-xl text-center w-full" style={{ top: '47%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {userName}
                </div>
              <div className="absolute text-xl font-medium max-lg:text-lg max-md:text-[9px] text-center w-full" style={{ top: '67.5%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            on {checkAndFormatDate(end)}
              </div>
              <div className="absolute text-center w-full" style={{ top: '63%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <p className="text-xl font-bold capitalize max-lg:text-lg max-md:text-[9px]">
                                {courseTitle}
                            </p>
                        </div>
              <div className="absolute text-center w-full" style={{ top: '83%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="flex flex-col items-center">
                  <img style={{ width: '40px', height: 'auto' }} src={logo} alt={name} />
                  <p className="text-xl justify-center self-center text-center font-semibold max-lg:text-lg max-md:text-xs mt-2">
                                {name}
                            </p>
                        </div>
                    </div>
                </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={handleDownload}
              disabled={processing}
              className="flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {processing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <FiDownload />
                  Download Certificate
                </>
              )}
            </motion.button>
            
            <div className="relative">
              <motion.button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center justify-center gap-2 py-3 px-8 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FiShare2 />
                Share Achievement
              </motion.button>
              
              {showShareOptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-64"
                >
                  <ShareOnSocial
                    textToShare={`I just completed the ${courseTitle} course on ${name}!`}
                    link={`${websiteURL}/shareable?id=${courseId}`}
                    linkTitle={`${userName} completed ${courseTitle} on ${name}`}
                    linkMetaDesc={`Check out this amazing course on ${name}`}
                    linkFavicon={logo}
                    noReferer
                  >
                    <div className="flex flex-col space-y-2">
                      <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        <FiShare2 /> Share on Social Media
                      </button>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Share your achievement with friends and colleagues!
                      </div>
                    </div>
                  </ShareOnSocial>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-6 max-w-lg w-full shadow-sm"
          >
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
              <FiAward className="mr-2" />
              What's Next?
            </h3>
            <ul className="space-y-3 text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                <span>Share your certificate on LinkedIn or other social platforms</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                <span>Explore more courses on related topics to expand your knowledge</span>
              </li>
              <li className="flex items-start">
                <FiCheck className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                <span>Apply your new skills to projects or professional work</span>
              </li>
            </ul>
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

export default Certificate;