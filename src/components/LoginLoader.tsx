import React, { useEffect, useState } from 'react';

export function LoginLoader() {
  const [text, setText] = useState('');
  const fullText = 'MENTORAID';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      // Reset after a pause
      const timeout = setTimeout(() => {
        setText('');
        setCurrentIndex(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-6">
            <span className="text-3xl font-bold text-blue-600">M</span>
          </div>
        </div>
        
        <div className="relative mb-8">
          <h1 className="text-5xl font-bold text-white tracking-wider">
            {text}
            <span className="animate-pulse">|</span>
          </h1>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-blue-100 mt-6 text-lg">Authenticating your access...</p>
      </div>
    </div>
  );
}