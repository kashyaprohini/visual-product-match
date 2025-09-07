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

  const handleImageUpload = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const similarProducts = await findSimilarProducts(imageFile);
      setResults(similarProducts);
    } catch (err) {
      setError(err.message || 'An error occurred while finding similar products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = results.filter(
    (product) => product.similarity_score <= maxSimilarityScore
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="mb-8">
            <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Results Section */}
          {results.length > 0 && !isLoading && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {results.length} Similar Products
                </h2>
                <SimilarityFilter
                  maxScore={maxSimilarityScore}
                  onScoreChange={setMaxSimilarityScore}
                  totalResults={results.length}
                  filteredResults={filteredResults.length}
                />
              </div>
              
              <ResultsList products={filteredResults} />
              
              {filteredResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No products match the current similarity filter. Try increasing the maximum similarity score.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !isLoading && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Image Uploaded</h3>
              <p className="text-gray-500">
                Upload an image to find visually similar products from our database.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
