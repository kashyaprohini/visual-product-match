import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

const ImageUploader = ({ onImageUpload, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage && onImageUpload) {
      onImageUpload(selectedImage);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card p-6 bg-gray-900 text-gray-100">
      <h2 className="text-xl font-semibold text-white mb-4">Upload Product Image</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? 'border-blue-400 bg-gray-800'
              : 'border-gray-700 hover:border-blue-400 bg-gray-900'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />

          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto max-h-64 rounded-lg shadow-lg"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-100">
                  Drop your image here, or{' '}
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                    disabled={isLoading}
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-400">
                  Supports: JPG, JPEG, PNG, GIF (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!selectedImage || isLoading}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <Upload className="w-5 h-5" />
            <span>{isLoading ? 'Finding Similar Products...' : 'Find Similar Products'}</span>
          </button>
        </div>
      </form>

      {selectedImage && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-200">
            <span className="font-medium">Selected file:</span> {selectedImage.name}
          </p>
          <p className="text-sm text-gray-200">
            <span className="font-medium">Size:</span> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
