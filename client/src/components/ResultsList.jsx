import React from 'react';
import ProductCard from './ProductCard';
import { Globe, Search } from 'lucide-react';

const ResultsList = ({ results, searchType = 'web_search' }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {searchType === 'web_search' ? (
            <Globe className="w-5 h-5 text-blue-600" />
          ) : (
            <Search className="w-5 h-5 text-green-600" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {searchType === 'web_search' ? 'Similar Products from the Web' : 'Similar Products'}
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </span>
      </div>

      {/* Results Description */}
      {searchType === 'web_search' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              These results are generated using AI-powered web search to find products similar to your uploaded image.
              Click on any product to visit the original source.
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product, index) => (
          <ProductCard key={product._id || `web-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
