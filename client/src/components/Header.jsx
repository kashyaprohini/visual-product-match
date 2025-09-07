import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Search className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visual Product Matcher</h1>
              <p className="text-sm text-gray-600">Find visually similar products using AI</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
