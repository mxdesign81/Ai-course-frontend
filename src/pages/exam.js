import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Quiz from 'react-quiz-component';
import axios from 'axios';
import { company, logo, serverURL } from '../constants';
import { FiAward, FiXCircle, FiArrowRight, FiLoader } from 'react-icons/fi';

const Exam = () => {
    const { state } = useLocation();
    const { topic, courseId, questions } = state;
    const [examJSON, setExamJSON] = useState({});
    const [completed, setCompleted] = useState(false);
    const [passedQuiz, setPassed] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
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

    useEffect(() => {
        init();
    }, []);

    const setQuizResult = (obj) => {
        const correctAnswers = obj.numberOfCorrectAnswers;
        const percentage = correctAnswers * 10;
        setScore(percentage);
        
        if (correctAnswers > 4) {
            setPassed(true);
            // Send email with success message
            sendEmail(
                "You Have Passed The Quiz", 
                `You Have Passed The Quiz 🎉 Successfully with ${percentage}%`
            );
            updateResult(correctAnswers);
        } else {
            setPassed(false);
        }
        setCompleted(true);
    };

    async function updateResult(correct) {
        const marks = correct * 10;
        const marksString = "" + marks;
        await axios.post(serverURL + '/api/updateresult', { courseId, marksString });
    }

    function init() {
        try {
            const topLevelKeys = Object.keys(questions);
        const quiz = {
            "quizTitle": topic + " Quiz",
                "quizSynopsis": "Take this quiz to test your knowledge of " + topic + ". You need 50% to pass and you can retry as many times as needed.",
            "nrOfQuestions": "10",
            "questions": questions[topLevelKeys[0]].map((item) => ({
                "question": item.question,
                "questionType": "text",
                "answerSelectionType": "single",
                "answers": item.options,
                "correctAnswer": item.answer === "A" ? "1" :
                    item.answer === "B" ? "2" :
                        item.answer === "C" ? "3" : "4",
                "messageForCorrectAnswer": "Correct",
                "messageForIncorrectAnswer": "Incorrect",
                "point": "10"
            }))
            };
            setExamJSON(quiz);
            setTimeout(() => setLoading(false), 800);
        } catch (error) {
            console.error("Error initializing quiz:", error);
            setLoading(false);
        }
    }

    // Function to exit full-screen mode
    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        setTimeout(() => {
            window.history.back();
        }, 100);
    };

    async function sendEmail(subject, msg) {
        const userName = sessionStorage.getItem('mName');
        const email = sessionStorage.getItem('email');

        const html = `
        <!DOCTYPE html>
                <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${topic} Quiz Result</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(to right, #f7f9fc, #e6edf7);
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header img {
              width: 80px;
              height: auto;
              margin-bottom: 15px;
            }
            h1 {
              color: #4263eb;
              font-size: 24px;
              margin: 0;
            }
            .content {
              background-color: white;
              border-radius: 8px;
              padding: 25px;
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            .highlight {
              font-weight: bold;
              color: #4263eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logo}" alt="${company} Logo">
              <h1>${topic} Quiz Result</h1>
            </div>
            <div class="content">
              <p>Hello <span class="highlight">${userName}</span>,</p>
              <p>${msg}</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The <span class="highlight">${company}</span> Team</p>
            </div>
                 </div>
                  </body>
                </html>
        `;

        try {
            await axios.post(serverURL + '/api/sendexammail', {
                html,
                email,
                subjects: subject
            });
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    const quizCustomStyles = {
        questionTitle: {
            background: "linear-gradient(to right, #4b6cb7, #182848)",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px 8px 0 0",
            fontWeight: "600",
        },
        questionContent: {
            backgroundColor: "#ffffff",
            color: "#333",
            padding: "20px",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "24px",
        },
        answerBtn: {
            borderRadius: "6px",
            padding: "12px 16px",
            backgroundColor: "#f1f5fd",
            color: "#333",
            border: "1px solid #ddd",
            marginBottom: "8px",
            textAlign: "left",
            transition: "all 0.2s ease",
        },
        prevNextBtn: {
            backgroundColor: "var(--primary-color, #4b6cb7)",
            color: "white",
            borderRadius: "6px",
            padding: "12px 24px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 10px rgba(75, 108, 183, 0.3)",
            margin: "0 10px",
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <AnimatePresence>
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center"
                    >
                        <div className="text-center">
                            <FiLoader className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin" />
                            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Preparing your quiz...</p>
                    </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        className="flex-1 flex flex-col items-center justify-center py-8 px-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                            variants={itemVariants}
                        >
                            {completed ? (
                                <div className="p-8 text-center">
                                    <motion.div 
                                        className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 260, 
                                            damping: 20 
                                        }}
                                    >
                                        {passedQuiz ? (
                                            <div className="bg-green-100 dark:bg-green-900/30 w-full h-full rounded-full flex items-center justify-center">
                                                <FiAward className="h-12 w-12 text-green-600 dark:text-green-400" />
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 dark:bg-red-900/30 w-full h-full rounded-full flex items-center justify-center">
                                                <FiXCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                    
                                    <motion.h2 
                                        className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {passedQuiz ? "Congratulations! 🎉" : "Not quite there yet 🤔"}
                                    </motion.h2>
                                    
                                    <motion.div
                                        className="mb-8 flex justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="relative w-32 h-32">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    strokeWidth="3"
                                                    strokeDasharray="100, 100"
                                                />
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={passedQuiz ? "#48bb78" : "#f56565"}
                                                    strokeWidth="3"
                                                    strokeDasharray={`${score}, 100`}
                                                    className="animate-[dash_1.5s_ease-in-out_forwards]"
                                                    style={{ 
                                                        strokeDasharray: `${score}, 100`,
                                                        animation: "dash 1.5s ease-in-out forwards"
                                                    }}
                                                />
                                                <text x="18" y="21" textAnchor="middle" fontSize="8" fill={passedQuiz ? "#48bb78" : "#f56565"} fontWeight="bold">
                                                    {score}%
                                                </text>
                                            </svg>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.p 
                                        className="text-lg text-gray-700 dark:text-gray-300 mb-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        {passedQuiz 
                                            ? "You've successfully passed the quiz! Your certificate is now available." 
                                            : "You need at least 50% to pass the quiz. Feel free to try again!"}
                                    </motion.p>
                                    
                                    <motion.button
                                        onClick={exitFullScreen}
                                        className="flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        {passedQuiz ? "View Certificate" : "Return to Course"}
                                        <FiArrowRight />
                                    </motion.button>
                            </div>
                            ) : (
                                <div className="quiz-container">
                                    <Quiz 
                                        shuffle={true} 
                                        quiz={examJSON} 
                                        onComplete={setQuizResult}
                                        showDefaultResult={false}
                                        customStyles={quizCustomStyles}
                                    />
                    </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Add some decorative elements */}
            <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>
            <div className="fixed bottom-0 left-0 w-1/3 h-screen bg-gradient-to-t from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 -z-10"></div>
            
            <style jsx>{`
                @keyframes dash {
                    from {
                        stroke-dasharray: 0, 100;
                    }
                    to {
                        stroke-dasharray: ${score}, 100;
                    }
                }
                
                /* Override some Quiz component styles */
                .quiz-container :global(.questionWrapper) {
                    max-width: 100%;
                    margin: 0;
                    border: none;
                }
                
                .quiz-container :global(.startQuizBtn),
                .quiz-container :global(.nextQuestionBtn) {
                    background: linear-gradient(to right, #4b6cb7, #182848);
                    color: white;
                    border-radius: 6px;
                    padding: 12px 24px;
                    font-weight: 600;
                    border: none;
                    transition: all 0.2s;
                }
                
                .quiz-container :global(.startQuizBtn:hover),
                .quiz-container :global(.nextQuestionBtn:hover) {
                    opacity: 0.9;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .quiz-container :global(.answerBtn:hover) {
                    background-color: #e6effd;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .quiz-container :global(.answerBtn.correct) {
                    background-color: #d4edda;
                    color: #155724;
                    border-color: #c3e6cb;
                }
                
                .quiz-container :global(.answerBtn.incorrect) {
                    background-color: #f8d7da;
                    color: #721c24;
                    border-color: #f5c6cb;
                }
            `}</style>
        </div>
    );
};

export default Exam;
