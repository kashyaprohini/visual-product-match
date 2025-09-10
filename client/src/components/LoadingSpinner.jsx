import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[50vh] bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Analyzing Image
        </h3>
        <p className="text-gray-300 max-w-md">
          Our AI is processing your image and finding visually similar products. This may take a few seconds...
        </p>
      </div>

      {/* Progress indicators */}
      <div className="mt-6 flex space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-md"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-md" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-md" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
