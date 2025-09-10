import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultsList from './components/ResultsList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import SimilarityFilter from './components/SimilarityFilter';
import { findSimilarProducts } from './services/api';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxSimilarityScore, setMaxSimilarityScore] = useState(20);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleImageUpload = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setAiAnalysis(null);

    try {
      console.log('Uploading image:', imageFile.name, imageFile.size, 'bytes');
      const response = await findSimilarProducts(imageFile);
      console.log('API Response:', response);
      
      if (response && typeof response === 'object') {
        if (response.similarProducts) {
          setResults(response.similarProducts);
          setAiAnalysis(response.uploadedImageAnalysis);
        } else if (Array.isArray(response)) {
          setResults(response);
        } else {
          setError('Unexpected response format from server');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while finding similar products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = results.filter(product => 
    (product.similarityScore || 0) >= (100 - maxSimilarityScore)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Visual Product Search
            </h1>
            <p className="text-lg text-gray-300">
             Upload an image — let AI find matching products for you.
            </p>
          </div>

          {/* Image Upload */}
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner />
              <p className="mt-4 text-gray-300">
                Analyzing your image and searching for similar products...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && <ErrorMessage message={error} />}

          {/* AI Analysis */}
          {aiAnalysis && (
            <div className="bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 border border-gray-700 rounded-lg p-6 mb-6 text-gray-100 shadow-md">
              <h3 className="text-lg font-semibold text-white mb-3">
                AI Image Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-400">Product Name:</span>
                  <span className="ml-2">{aiAnalysis.productName}</span>
                </div>
                <div>
                  <span className="font-medium text-purple-400">Category:</span>
                  <span className="ml-2">{aiAnalysis.category}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-blue-400">Description:</span>
                  <span className="ml-2">{aiAnalysis.description}</span>
                </div>
                {aiAnalysis.colors && aiAnalysis.colors.length > 0 && (
                  <div>
                    <span className="font-medium text-purple-400">Colors:</span>
                    <span className="ml-2">{aiAnalysis.colors.join(', ')}</span>
                  </div>
                )}
                {aiAnalysis.style && (
                  <div>
                    <span className="font-medium text-blue-400">Style:</span>
                    <span className="ml-2">{aiAnalysis.style}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <>
              <SimilarityFilter
                maxScore={maxSimilarityScore}
                onScoreChange={setMaxSimilarityScore}
                totalResults={results.length}
                filteredResults={filteredResults.length}
              />
              
              <ResultsList 
                results={filteredResults} 
                searchType="web_search"
              />
            </>
          )}

          {/* No Results */}
          {!isLoading && !error && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Upload an image to start searching for similar products
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
