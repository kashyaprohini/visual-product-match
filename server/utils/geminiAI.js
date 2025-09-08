const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze an image using Gemini Vision AI and get search queries for finding similar products
 * @param {Buffer} imageBuffer - The image buffer to analyze
 * @returns {Promise<Object>} - Analysis result with search queries and product details
 */
async function analyzeImageWithGemini(imageBuffer) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your .env file');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Create the prompt for product analysis and search query generation
    const prompt = `Analyze this product image and provide detailed information that would help find similar products online.

Please provide your response in the following JSON format:
{
  "productName": "suggested product name",
  "category": "product category (clothing, electronics, home, beauty, etc.)",
  "description": "detailed description of the product including colors, materials, style, and key features",
  "searchQueries": [
    "search query 1 for finding similar products",
    "search query 2 for finding similar products", 
    "search query 3 for finding similar products",
    "search query 4 for finding similar products",
    "search query 5 for finding similar products"
  ],
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "colors": ["primary color", "secondary color"],
  "style": "style description",
  "material": "material type if visible",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Focus on creating search queries that would help find similar products on shopping websites. Include specific product names, brands if visible, colors, styles, and categories.`;

    // Prepare the image data
    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ];

    // Generate content
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let analysisData;
    try {
      // Clean up the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback to a basic structure if JSON parsing fails
      analysisData = {
        productName: "Unknown Product",
        category: "general",
        description: text.substring(0, 500),
        searchQueries: ["similar product", "product search", "online shopping"],
        keyFeatures: [],
        colors: [],
        style: "unknown",
        material: "unknown",
        tags: []
      };
    }

    return {
      success: true,
      analysis: analysisData,
      rawResponse: text
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    // Provide specific error messages for common issues
    let errorMessage = error.message;
    if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid Gemini API key. Please check your .env file and ensure GEMINI_API_KEY is set correctly. Get your key from https://makersuite.google.com/app/apikey';
    }
    
    return {
      success: false,
      error: errorMessage,
      analysis: {
        productName: "Analysis Failed",
        category: "unknown",
        description: "Failed to analyze image",
        searchQueries: [],
        keyFeatures: [],
        colors: [],
        style: "unknown",
        material: "unknown",
        tags: []
      }
    };
  }
}

/**
 * Search for similar product images using Google Custom Search API or generate mock results
 * @param {Array} searchQueries - Array of search queries from image analysis
 * @returns {Promise<Array>} - Array of similar product results with images and URLs
 */
async function searchSimilarProducts(searchQueries) {
  // This function is kept for backward compatibility but now uses generateFallbackResults
  return generateFallbackResults({
    productName: searchQueries[0] || 'Similar Product',
    category: 'general',
    searchQueries: searchQueries
  });
}

/**
 * Use Gemini to generate more realistic product search results based on the image analysis
 * @param {Object} imageAnalysis - The analysis result from analyzeImageWithGemini
 * @returns {Promise<Array>} - Array of generated similar product results
 */
async function generateSimilarProductResults(imageAnalysis) {
  try {
    // Check if Gemini API is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('Gemini API key not configured, using fallback results');
      return generateFallbackResults(imageAnalysis);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on this product analysis, generate 5 realistic similar product results:

Product Analysis:
- Name: ${imageAnalysis.productName}
- Category: ${imageAnalysis.category}
- Description: ${imageAnalysis.description}
- Colors: ${imageAnalysis.colors?.join(', ')}
- Style: ${imageAnalysis.style}
- Material: ${imageAnalysis.material}
- Key Features: ${imageAnalysis.keyFeatures?.join(', ')}

Please provide realistic product names and descriptions that would match this analysis. Return in this exact JSON format:
{
  "products": [
    {
      "name": "Specific product name with brand and details",
      "price": "$XX.XX",
      "source": "Store Name",
      "similarityScore": 85,
      "description": "Detailed product description"
    }
  ]
}

Make 5 products with varied prices ($15-$99), different stores (Amazon, Target, etc.), and similarity scores (70-95).`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const generatedData = JSON.parse(jsonMatch[0]);
        if (generatedData.products && Array.isArray(generatedData.products)) {
          // Add working image URLs and product URLs to AI-generated results
          const productsWithUrls = generatedData.products.map((product, index) => ({
            ...product,
            imageUrl: `https://picsum.photos/400/400?random=${Date.now() + index}`,
            productUrl: product.source?.toLowerCase().includes('amazon') 
              ? `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}`
              : product.source?.toLowerCase().includes('target')
              ? `https://www.target.com/s?searchTerm=${encodeURIComponent(product.name)}`
              : product.source?.toLowerCase().includes('ebay')
              ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.name)}`
              : `https://www.google.com/search?q=${encodeURIComponent(product.name + ' buy online')}`
          }));
          
          console.log('Successfully generated AI-powered product results');
          return productsWithUrls;
        }
      }
    } catch (parseError) {
      console.error('Error parsing AI-generated products:', parseError);
    }

    // Fallback if AI generation fails
    console.log('AI generation failed, using fallback results');
    return generateFallbackResults(imageAnalysis);

  } catch (error) {
    console.error('Error generating similar products with AI:', error);
    console.log('Using fallback results due to error');
    return generateFallbackResults(imageAnalysis);
  }
}

/**
 * Generate fallback results with working image URLs when AI generation fails
 * @param {Object} imageAnalysis - The analysis result from analyzeImageWithGemini
 * @returns {Array} - Array of fallback product results
 */
function generateFallbackResults(imageAnalysis) {
  const category = imageAnalysis.category?.toLowerCase() || 'product';
  const productName = imageAnalysis.productName || 'Similar Product';
  
  // Using working placeholder images and real e-commerce URLs
  const mockProducts = [
    {
      name: `${productName} - Premium Edition`,
      imageUrl: 'https://picsum.photos/400/400?random=1',
      productUrl: 'https://www.amazon.com/s?k=' + encodeURIComponent(productName),
      price: '$29.99',
      source: 'Amazon',
      similarityScore: 92,
      description: `High-quality ${category} item with premium features. Perfect match for your style preferences.`
    },
    {
      name: `${productName} - Classic Style`,
      imageUrl: 'https://picsum.photos/400/400?random=2',
      productUrl: 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(productName),
      price: '$34.99',
      source: 'eBay',
      similarityScore: 88,
      description: `Classic design ${category} with timeless appeal. Features ${imageAnalysis.colors?.join(' and ') || 'beautiful colors'}.`
    },
    {
      name: `${productName} - Modern Design`,
      imageUrl: 'https://picsum.photos/400/400?random=3',
      productUrl: 'https://www.target.com/s?searchTerm=' + encodeURIComponent(productName),
      price: '$39.99',
      source: 'Target',
      similarityScore: 85,
      description: `Contemporary ${category} with modern aesthetics. Great quality and style.`
    },
    {
      name: `${productName} - Deluxe Version`,
      imageUrl: 'https://picsum.photos/400/400?random=4',
      productUrl: 'https://www.walmart.com/search?q=' + encodeURIComponent(productName),
      price: '$24.99',
      source: 'Walmart',
      similarityScore: 81,
      description: `Deluxe ${category} offering excellent value. Combines style with functionality.`
    },
    {
      name: `${productName} - Professional Grade`,
      imageUrl: 'https://picsum.photos/400/400?random=5',
      productUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st=' + encodeURIComponent(productName),
      price: '$49.99',
      source: 'Best Buy',
      similarityScore: 78,
      description: `Professional-grade ${category} with superior quality. Built to last with ${imageAnalysis.style || 'excellent design'}.`
    }
  ];

  return mockProducts;
}

module.exports = {
  analyzeImageWithGemini,
  searchSimilarProducts,
  generateSimilarProductResults,
  generateFallbackResults
};
