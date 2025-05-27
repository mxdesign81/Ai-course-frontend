import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiPlus, FiMinus, FiVideo, FiImage, FiGlobe, FiLoader } from 'react-icons/fi';

import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';

const Create = () => {
    const maxSubtopics = 5;
    const [formValues, setFormValues] = useState([{ sub: "" }]);
    const [processing, setProcessing] = useState(false);
    const [selectedValue, setSelectedValue] = useState('4');
    const [selectedType, setSelectedType] = useState('Text & Image Course');
    const [paidMember, setPaidMember] = useState(false);
    const [lang, setLang] = useState('English');
    const [lableText, setLableText] = useState('For free member sub topics is limited to 5');
    const navigate = useNavigate();

    const languages = [
        { "code": "en", "name": "English" },
        { "code": "ar", "name": "Arabic" },
        { "code": "bn", "name": "Bengali" },
        { "code": "bg", "name": "Bulgarian" },
        { "code": "zh", "name": "Chinese" },
        { "code": "hr", "name": "Croatian" },
        { "code": "cs", "name": "Czech" },
        { "code": "da", "name": "Danish" },
        { "code": "nl", "name": "Dutch" },
        { "code": "et", "name": "Estonian" },
        { "code": "fi", "name": "Finnish" },
        { "code": "fr", "name": "French" },
        { "code": "de", "name": "German" },
        { "code": "el", "name": "Greek" },
        { "code": "he", "name": "Hebrew" },
        { "code": "hi", "name": "Hindi" },
        { "code": "hu", "name": "Hungarian" },
        { "code": "id", "name": "Indonesian" },
        { "code": "it", "name": "Italian" },
        { "code": "ja", "name": "Japanese" },
        { "code": "ko", "name": "Korean" },
        { "code": "lv", "name": "Latvian" },
        { "code": "lt", "name": "Lithuanian" },
        { "code": "no", "name": "Norwegian" },
        { "code": "pl", "name": "Polish" },
        { "code": "pt", "name": "Portuguese" },
        { "code": "ro", "name": "Romanian" },
        { "code": "ru", "name": "Russian" },
        { "code": "sr", "name": "Serbian" },
        { "code": "sk", "name": "Slovak" },
        { "code": "sl", "name": "Slovenian" },
        { "code": "es", "name": "Spanish" },
        { "code": "sw", "name": "Swahili" },
        { "code": "sv", "name": "Swedish" },
        { "code": "th", "name": "Thai" },
        { "code": "tr", "name": "Turkish" },
        { "code": "uk", "name": "Ukrainian" },
        { "code": "vi", "name": "Vietnamese" }
    ];

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

  const formControlVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

    useEffect(() => {
        if (sessionStorage.getItem('type') !== 'free') {
            setPaidMember(true);
      setLableText('Select number of sub topics');
        }
    }, []);

  const handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
  };

  const addFormFields = () => {
        if (formValues.length < maxSubtopics) {
            setFormValues([...formValues, { sub: "" }]);
        } else {
            showToast('You can only add 5 sub topics');
        }
  };

  const removeFormFields = () => {
    if (formValues.length > 1) {
        let newFormValues = [...formValues];
        newFormValues.pop();
        setFormValues(newFormValues);
    }
  };

  const showPaidToast = () => {
        if (!paidMember) {
            toast("For paid members only", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const subtopics = [];
        setProcessing(true);
    
    // Extract subtopics from form
    const subtopicElements = document.querySelectorAll('input[id="subtopic"]');
    subtopicElements.forEach(element => {
      if (element.value.trim()) {
        subtopics.push(element.value.trim());
      }
        });

        const mainTopic = document.getElementById('topic1').value;

        if (!mainTopic.trim()) {
            setProcessing(false);
      showToast('Please enter a main topic');
            return;
        }

        if (subtopics.length === 0) {
            setProcessing(false);
      showToast('Please add at least one subtopic');
            return;
        }

        const prompt = `Strictly in ${lang}, Generate a list of Strict ${selectedValue} topics and any number sub topic for each topic for main title ${mainTopic.toLowerCase()}, everything in single line. Those ${selectedValue} topics should Strictly include these topics :- ${subtopics.join(', ').toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
            "${mainTopic.toLowerCase()}": [
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       },
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       }
      ]
      }`;

    sendPrompt(prompt, mainTopic, selectedType);
    };

    async function sendPrompt(prompt, mainTopic, selectedType) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/prompt';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.generatedText;
            const cleanedJsonString = generatedText.replace(/```json/g, '').replace(/```/g, '');
            try {
                const parsedJson = JSON.parse(cleanedJsonString);
                setProcessing(false);
        navigate('/topics', { 
          state: { 
            jsonData: parsedJson, 
            mainTopic: mainTopic.toLowerCase(), 
            type: selectedType.toLowerCase(), 
            lang 
          } 
        });
            } catch (error) {
        sendPrompt(prompt, mainTopic, selectedType);
            }
        } catch (error) {
      sendPrompt(prompt, mainTopic, selectedType);
    }
  }

    return (
    <div className="min-h-screen flex flex-col">
            <Header isHome={true} className="sticky top-0 z-50" />

      <main className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <div className="container max-w-2xl mx-auto py-12 px-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="p-6 md:p-8">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Create Your Course
                </h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Enter your main topic and subtopics to generate a personalized learning experience
                </p>
              </motion.div>
              
              <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} className="mb-6">
                  <label htmlFor="topic1" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Main Topic
                  </label>
                  <div className="relative">
                    <input 
                      id="topic1" 
                      type="text" 
                      placeholder="Enter the main subject (e.g. JavaScript, Machine Learning)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subtopics
                  </label>
                  <div className="space-y-3">
                                {formValues.map((element, index) => (
                      <motion.div
                        key={index}
                        variants={formControlVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative"
                      >
                        <input
                          id="subtopic"
                          name="subtopic"
                          type="text"
                          placeholder={`Subtopic ${index + 1} (e.g. Loops, Functions)`}
                          onChange={e => handleChange(index, e)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </motion.div>
                                ))}
                            </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex space-x-3 mb-6">
                  <button
                    type="button"
                    onClick={addFormFields}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                  >
                    <FiPlus />
                    Add Subtopic
                  </button>

                            {formValues.length > 1 && (
                    <button
                      type="button"
                      onClick={removeFormFields}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-all"
                    >
                      <FiMinus />
                      Remove
                    </button>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {lableText}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${selectedValue === '4' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                      <input
                        type="radio"
                        name="topicCount"
                        value="4"
                        checked={selectedValue === '4'}
                        onChange={() => setSelectedValue('4')}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-gray-800 dark:text-gray-100 font-medium">5 Topics</span>
                    </label>
                    
                    <label 
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${!paidMember ? 'opacity-60' : ''} ${selectedValue === '7' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                      onClick={!paidMember ? showPaidToast : undefined}
                    >
                      <input
                        type="radio"
                        name="topicCount"
                        value="7"
                        checked={selectedValue === '7'}
                        onChange={() => setSelectedValue('7')}
                        disabled={!paidMember}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-gray-800 dark:text-gray-100 font-medium">10 Topics</span>
                      {!paidMember && <span className="absolute right-2 top-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">PRO</span>}
                    </label>
                                </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${selectedType === 'Text & Image Course' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                      <input
                        type="radio"
                        name="courseType"
                        value="Text & Image Course"
                        checked={selectedType === 'Text & Image Course'}
                        onChange={() => setSelectedType('Text & Image Course')}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div className="flex items-center gap-2">
                        <FiImage className="text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-800 dark:text-gray-100 font-medium">Theory & Images</span>
                                </div>
                    </label>
                    
                    <label 
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${!paidMember ? 'opacity-60' : ''} ${selectedType === 'Video & Text Course' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                      onClick={!paidMember ? showPaidToast : undefined}
                    >
                      <input
                        type="radio"
                        name="courseType"
                        value="Video & Text Course"
                        checked={selectedType === 'Video & Text Course'}
                        onChange={() => setSelectedType('Video & Text Course')}
                        disabled={!paidMember}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div className="flex items-center gap-2">
                        <FiVideo className="text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-800 dark:text-gray-100 font-medium">Videos & Theory</span>
                                </div>
                      {!paidMember && <span className="absolute right-2 top-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">PRO</span>}
                    </label>
                                </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-8">
                  <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Course Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiGlobe className="text-gray-500 dark:text-gray-400" />
                                </div>
                    <select
                      id="language"
                                    value={lang}
                                    onChange={(e) => {
                                        if (!paidMember) {
                                            showPaidToast();
                        } else {
                                            setLang(e.target.value);
                                        }
                      }}
                      className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      disabled={!paidMember}
                    >
                                    {languages.map((country) => (
                                        <option key={country.code} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                            </div>
                        </div>
                  {!paidMember && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Language selection is available for Pro members only
                    </p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Generating Course...
                      </>
                    ) : (
                      'Create Course'
                    )}
                  </button>
                </motion.div>
                    </form>
            </div>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-40 right-10 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5 hidden md:block"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
          
          <motion.div 
            className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-purple-400/5 dark:bg-purple-500/5 hidden md:block"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 9, delay: 1 }}
          />
        </div>
      </main>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Create;

