import React from 'react';
import { Filter } from 'lucide-react';

const SimilarityFilter = ({ maxScore, onScoreChange, totalResults, filteredResults }) => {
  // Convert the score to percentage for display (since AI similarity is 0-100)
  const minSimilarityPercent = 100 - maxScore;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex-1">
          <label htmlFor="similarity-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Similarity: {minSimilarityPercent}%
          </label>
          <input
            id="similarity-filter"
            type="range"
            min="0"
            max="60"
            value={maxScore}
            onChange={(e) => onScoreChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100% (Perfect Match)</span>
            <span>70% (Good Match)</span>
            <span>40% (Fair Match)</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        Showing {filteredResults} of {totalResults} results with AI similarity ≥ {minSimilarityPercent}%
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SimilarityFilter;
