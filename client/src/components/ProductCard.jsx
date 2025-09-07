import React, { useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSimilarityLabel = (score) => {
    if (score <= 5) return { label: 'Excellent Match', color: 'text-green-600 bg-green-100' };
    if (score <= 10) return { label: 'Good Match', color: 'text-blue-600 bg-blue-100' };
    if (score <= 15) return { label: 'Fair Match', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Poor Match', color: 'text-red-600 bg-red-100' };
  };

  const similarity = getSimilarityLabel(product.similarity_score);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-200 rounded-t-lg"></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover rounded-t-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-lg">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Similarity Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${similarity.color}`}>
            {similarity.label}
          </span>
        </div>
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
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
            {product.category}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {Math.max(1, 5 - Math.floor(product.similarity_score / 4)).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Score: {product.similarity_score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
