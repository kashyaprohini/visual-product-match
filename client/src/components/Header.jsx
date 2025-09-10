import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-400 rounded-lg shadow-md hover:bg-blue-500 transition-colors duration-300">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white">LookAlike</h1>
              <p className="text-sm text-gray-200">See it. Snap it. Find it</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

