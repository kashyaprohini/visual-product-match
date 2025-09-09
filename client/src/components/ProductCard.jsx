import React, { useState } from 'react';
import { ExternalLink, Star, Tag, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSimilarityLabel = (score) => {
    // Updated for new similarity scoring (0-100, higher is better)
    if (score >= 80) return { label: 'Excellent Match', color: 'text-green-600 bg-green-100' };
    if (score >= 60) return { label: 'Good Match', color: 'text-blue-600 bg-blue-100' };
    if (score >= 40) return { label: 'Fair Match', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Poor Match', color: 'text-red-600 bg-red-100' };
  };

  // Use the new simplified similarityScore field
  const similarityScore = product.similarityScore || 0;
  const similarity = getSimilarityLabel(similarityScore);

  const handleProductClick = () => {
    if (product.productUrl) {
      window.open(product.productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-200 cursor-pointer group">
      {/* Header Section with Similarity Badge */}
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-lg border-b" onClick={handleProductClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Product Match</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${similarity.color}`}>
            {similarity.label}
          </span>
        </div>

        {/* Hover overlay for web products */}
        {product.productUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-t-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1" title={product.name}>
            {product.name}
          </h3>
          <button 
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View details"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Source */}
          <div className="flex items-center justify-end">
            {product.source && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {product.source}
              </span>
            )}
          </div>

          {/* Category */}
          <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
            {product.category}
          </p>
          
          {/* Product Description */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {(similarityScore / 20).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {similarityScore}% match
            </span>
          </div>

          {/* Action Button */}
          {product.productUrl && (
            <button
              onClick={handleProductClick}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Check Product</span>
            </button>
          )}
          
          {/* Detailed Information */}
          {showDetails && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
              <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
              
              {product.searchQuery && (
                <div className="mb-2">
                  <span className="text-gray-500 text-xs">Search Query: </span>
                  <span className="text-gray-700 text-xs">{product.searchQuery}</span>
                </div>
              )}
              
              {product.description && (
                <div className="mb-2">
                  <span className="text-gray-500 text-xs">Description: </span>
                  <span className="text-gray-700 text-xs">{product.description}</span>
                </div>
              )}
              
              {product.productUrl && (
                <div className="mb-2">
                  <span className="text-gray-500 text-xs">URL: </span>
                  <a 
                    href={product.productUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {product.productUrl.slice(0, 50)}...
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
