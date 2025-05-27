import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiArrowRight, FiArrowLeft, FiLoader, FiList, FiCheckCircle } from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';

const Topics = () => {
    const { state } = useLocation();
    const [processing, setProcessing] = useState(false);
    const { jsonData, mainTopic, type, lang } = state || {};
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
    
    const topicVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6, 
                delay: custom * 0.1 
            }
        })
    };
    
    const subtopicVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            transition: { 
                duration: 0.3, 
                delay: 0.1 + (custom * 0.05) 
            }
        })
    };

    useEffect(() => {
        if (!jsonData) {
            navigate("/create");
        }
    }, []);

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

    const redirectCreate = () => {
        navigate("/create");
    };

    const redirectCourse = () => {
        const mainTopicData = jsonData[mainTopic][0];
        const firstSubtopic = mainTopicData.subtopics[0];

        if (type === 'video & text course') {
            const query = `${firstSubtopic.title} ${mainTopic}`;
            sendVideo(query, firstSubtopic.title);
            setProcessing(true);
        } else {
            const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${firstSubtopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
            const promptImage = `Example of ${firstSubtopic.title} in ${mainTopic}`;
            setProcessing(true);
            sendPrompt(prompt, promptImage);
        }
    };

    async function sendPrompt(prompt, promptImage) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;

            try {
                const parsedJson = htmlContent;
                sendImage(parsedJson, promptImage);
            } catch (error) {
                sendPrompt(prompt, promptImage);
            }
        } catch (error) {
            sendPrompt(prompt, promptImage);
        }
    }

    async function sendImage(parsedJson, promptImage) {
        const dataToSend = {
            prompt: promptImage,
        };
        try {
            const postURL = serverURL + '/api/image';
            const res = await axios.post(postURL, dataToSend);
            try {
                const generatedText = res.data.url;
                sendData(generatedText, parsedJson);
                setProcessing(false);
            } catch (error) {
                sendImage(parsedJson, promptImage);
            }
        } catch (error) {
            sendImage(parsedJson, promptImage);
        }
    }

    async function sendData(image, theory) {
        jsonData[mainTopic][0].subtopics[0].theory = theory;
        jsonData[mainTopic][0].subtopics[0].image = image;

        const user = sessionStorage.getItem('uid');
        const content = JSON.stringify(jsonData);
        const postURL = serverURL + '/api/course';
        const response = await axios.post(postURL, { user, content, type, mainTopic, lang });

        if (response.data.success) {
            showToast(response.data.message);
            sessionStorage.setItem('courseId', response.data.courseId);
            sessionStorage.setItem('first', response.data.completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            navigate('/course', { 
                state: { 
                    jsonData: jsonData, 
                    mainTopic: mainTopic.toUpperCase(), 
                    type: type.toLowerCase(), 
                    courseId: response.data.courseId, 
                    end: '', 
                    pass: false, 
                    lang 
                } 
            });
        } else {
            sendData(image, theory);
        }
    }

    async function sendDataVideo(image, theory) {
        jsonData[mainTopic][0].subtopics[0].theory = theory;
        jsonData[mainTopic][0].subtopics[0].youtube = image;

        const user = sessionStorage.getItem('uid');
        const content = JSON.stringify(jsonData);
        const postURL = serverURL + '/api/course';
        const response = await axios.post(postURL, { user, content, type, mainTopic, lang });

        if (response.data.success) {
            showToast(response.data.message);
            sessionStorage.setItem('courseId', response.data.courseId);
            sessionStorage.setItem('first', response.data.completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            navigate('/course', { 
                state: { 
                    jsonData: jsonData, 
                    mainTopic: mainTopic.toUpperCase(), 
                    type: type.toLowerCase(), 
                    courseId: response.data.courseId, 
                    end: '', 
                    pass: false, 
                    lang 
                } 
            });
        } else {
            sendDataVideo(image, theory);
        }
    }

    async function sendVideo(query, subtopic) {
        const dataToSend = {
            prompt: query,
        };
        try {
            const postURL = serverURL + '/api/yt';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                sendTranscript(generatedText, subtopic);
            } catch (error) {
                sendVideo(query, subtopic);
            }
        } catch (error) {
            sendVideo(query, subtopic);
        }
    }

    async function sendTranscript(url, subtopic) {
        const dataToSend = {
            prompt: url,
        };
        try {
            const postURL = serverURL + '/api/transcript';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                const allText = generatedText.map(item => item.text);
                const concatenatedText = allText.join(' ');
                const prompt = `Strictly in ${lang}, Summarize this theory in a teaching way and :- ${concatenatedText}.`;
                sendSummery(prompt, url);
            } catch (error) {
                const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
                sendSummery(prompt, url);
            }
        } catch (error) {
            const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtopic}. Please Strictly Don't Give Additional Resources And Images.`;
            sendSummery(prompt, url);
        }
    }

    async function sendSummery(prompt, url) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;

            try {
                const parsedJson = htmlContent;
                setProcessing(false);
                sendDataVideo(url, parsedJson);
            } catch (error) {
                sendSummery(prompt, url);
            }
        } catch (error) {
            sendSummery(prompt, url);
        }
    }

    const renderTopicsAndSubtopics = (topics) => {
            return (
            <div className="space-y-6">
                {topics.map((topic, index) => (
                    <motion.div 
                        key={topic.title}
                        custom={index}
                        variants={topicVariants}
                        className="overflow-hidden"
                    >
                        <h3 className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-t-lg shadow-sm">
                            {topic.title}
                        </h3>
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-b-lg p-2">
                            <div className="space-y-2">
                                {topic.subtopics.map((subtopic, subIndex) => (
                                    <motion.div
                                        key={subtopic.title}
                                        custom={subIndex}
                                        variants={subtopicVariants}
                                    >
                                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center">
                                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{subtopic.title}</span>
                            </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </div>
            );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header isHome={true} className="sticky top-0 z-50" />
            
            <main className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
                <motion.div 
                    className="max-w-3xl mx-auto pt-12 pb-20 px-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            {mainTopic}
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300">
                            Your personalized course will cover the following topics and subtopics
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-sm mb-6"
                    >
                        <div className="flex items-center gap-3 mb-6 text-gray-700 dark:text-gray-300">
                            <FiList className="text-blue-600 dark:text-blue-400" size={20} />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Outline</h2>
                        </div>
                        
                        {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic])}
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={redirectCourse}
                            disabled={processing}
                            className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Generating Course...
                                </>
                            ) : (
                                <>
                                    Generate Course
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={redirectCreate}
                            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft />
                            Go Back
                        </button>
                    </motion.div>
                    
                    <motion.div 
                        variants={itemVariants}
                        className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 text-blue-800 dark:text-blue-300 flex items-start gap-3"
                    >
                        <FiCheckCircle className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" size={18} />
                        <div className="text-sm">
                            <p className="font-medium">Your course will be created using AI:</p>
                            <ul className="mt-2 list-disc list-inside ml-1 space-y-1">
                                <li>All topics will include comprehensive theory content</li>
                                <li>Each subtopic will have {type === 'video & text course' ? 'a relevant video' : 'illustrative images'}</li>
                                <li>You'll be able to track your progress as you learn</li>
                                <li>A quiz will be generated at the end to test your knowledge</li>
                            </ul>
                    </div>
                    </motion.div>
                </motion.div>
            </main>
            
            {/* Decorative elements */}
            <motion.div 
                className="fixed top-40 right-10 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5 hidden md:block"
                animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 8 }}
            />
            
            <motion.div 
                className="fixed bottom-20 left-10 w-24 h-24 rounded-full bg-purple-400/5 dark:bg-purple-500/5 hidden md:block"
                animate={{ 
                    y: [0, 15, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 9, delay: 1 }}
            />
            
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Topics;