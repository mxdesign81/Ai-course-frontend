import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../res/img/logo.svg';
import DarkLogo from '../res/img/darkLogo.svg';
import { websiteURL } from '../constants';

const LogoComponent = ({ isDarkMode }) => {

    function redirectHome() {
        window.location.href = websiteURL;
    }

    return (
        <motion.img 
            alt='logo' 
            src={isDarkMode === "true" ? DarkLogo : Logo} 
            className="h-8 w-auto cursor-pointer" 
            onClick={redirectHome}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 }
            }}
        />
    );
};

export default LogoComponent;
