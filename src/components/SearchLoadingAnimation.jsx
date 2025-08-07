/**
 * Loading Animation Component for Search
 * Provides a buffer loading animation during search operations
 */

import React from 'react';

export function SearchLoadingAnimation({ isLoading, searchQuery }) {
  if (!isLoading) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 shadow-xl border border-blue-200 text-center">
      {/* Main loading animation */}
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
          </div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading text with typing animation */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-blue-800">
          🤖 AI Search in Progress
        </h3>
        
        <div className="flex items-center justify-center space-x-2 text-blue-700">
          <span className="font-medium">Analyzing</span>
          <span className="font-bold text-blue-800">"{searchQuery}"</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* Progress steps */}
        <div className="mt-6 space-y-2 text-sm text-blue-600">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Processing search query</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing compliance frameworks</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            <span className="text-gray-400">Generating recommendations</span>
          </div>
        </div>
      </div>

      {/* Fun loading messages */}
      <div className="mt-6 text-xs text-blue-500 italic">
        <LoadingMessage />
      </div>
    </div>
  );
}

function LoadingMessage() {
  const messages = [
    "Consulting our AI compliance expert...",
    "Scanning regulatory requirements...",
    "Cross-referencing legal frameworks...",
    "Identifying relevant compliance standards...",
    "Analyzing jurisdictional requirements...",
    "Processing regulatory guidelines...",
    "Matching your query to compliance rules...",
    "Preparing personalized recommendations..."
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="transition-all duration-500">
      {messages[currentMessage]}
    </div>
  );
}

export default SearchLoadingAnimation;
