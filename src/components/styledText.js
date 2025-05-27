import React from 'react';

const StyledText = ({ text }) => {
  // If text is empty, return null
  if (!text) return null;

  // Process text to enhance links if needed
  const enhancedText = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>'
  );

  return (
    <div 
      className='text-gray-800 dark:text-gray-200 policy-content' 
      dangerouslySetInnerHTML={{ __html: enhancedText }} 
    />
  );
};

export default StyledText;