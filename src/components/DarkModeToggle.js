import React, { useState, useEffect } from 'react';
import { HiSun, HiMoon } from "react-icons/hi";
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = sessionStorage.getItem('darkMode');
        if (storedTheme !== null) {
            return storedTheme === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        window.location.reload();
    };

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
        sessionStorage.setItem('darkMode', isDarkMode);
    });

    return (
        <motion.button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: isDarkMode ? -15 : 15 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {isDarkMode ? (
                <motion.div
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <HiMoon size={20} />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <HiSun size={20} />
                </motion.div>
            )}
        </motion.button>
    );
};

export default DarkModeToggle;
