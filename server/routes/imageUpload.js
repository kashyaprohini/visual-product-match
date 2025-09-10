const express = require('express');
const multer = require('multer');
const { analyzeImageWithGemini, generateSimilarProductResults } = require('../utils/geminiAI');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Find similar products endpoint - Now uses web search via Gemini AI
router.post('/products/find-similar', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    console.log('Analyzing uploaded image with Gemini AI...');
    console.log('Image size:', req.file.size, 'bytes');
    console.log('Image type:', req.file.mimetype);
    
    // Analyze the uploaded image with Gemini AI
    const analysisResult = await analyzeImageWithGemini(req.file.buffer);
    
    if (!analysisResult.success) {
      console.error('AI analysis failed:', analysisResult.error);
      return res.status(500).json({ 
        error: 'Failed to analyze image with AI',
        details: analysisResult.error 
      });
    }

    console.log('AI Analysis successful:', analysisResult.analysis);

    // Generate similar product results using AI
    console.log('Generating similar product results...');
    const similarProducts = await generateSimilarProductResults(analysisResult.analysis);

    console.log('Generated', similarProducts.length, 'similar products');

    // Format the response - Clean schema without redundant fields
    const formattedResults = similarProducts.map((product, index) => ({
      _id: `ai-search-${Date.now()}-${index}`,
      name: product.name,
      category: analysisResult.analysis.category,
      productUrl: product.productUrl,
      price: product.price,
      source: product.source,
      description: product.description,
      similarityScore: product.similarityScore
    }));

    console.log('Returning', formattedResults.length, 'formatted results');

    res.json({
      uploadedImageAnalysis: analysisResult.analysis,
      similarProducts: formattedResults,
      searchType: 'web_search',
      message: 'Found similar products from web search'
    });

  } catch (error) {
    console.error('Error finding similar products:', error);
    res.status(500).json({ 
      error: 'Failed to find similar products',
      details: error.message 
    });
  }
});

module.exports = router;

// Upload new product with image and AI analysis
router.post('/upload-product', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { name, category } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    console.log('Analyzing new product with Gemini AI...');

    // Analyze the image with Gemini AI
    const analysisResult = await analyzeImageWithGemini(req.file.buffer);

    // Calculate perceptual hash for backward compatibility
    let imageHash = '';
    try {
      imageHash = await calculatePerceptualHash(req.file.buffer);
    } catch (hashError) {
      console.warn('Could not calculate perceptual hash:', hashError.message);
    }

    // Convert image to Base64 for storage in MongoDB
    const imageBase64 = req.file.buffer.toString('base64');
    const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Create new product with AI analysis
    const product = new Product({
      name,
      category,
      imageUrl: imageDataUrl,
      imageHash,
      aiAnalysis: analysisResult.success ? analysisResult.analysis : {
        productName: name,
        category: category,
        description: 'AI analysis failed',
        keyFeatures: [],
        colors: [],
        style: 'unknown',
        material: 'unknown',
        tags: []
      },
      aiRawResponse: analysisResult.rawResponse || '',
      aiAnalyzed: analysisResult.success
    });

    await product.save();

    res.status(201).json({
      message: 'Product uploaded and analyzed successfully',
      product: {
        _id: product._id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        aiAnalysis: product.aiAnalysis,
        aiAnalyzed: product.aiAnalyzed
      },
      analysisSuccess: analysisResult.success
    });

  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().select('-imageHash');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-imageHash');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Delete product
router.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }
    return res.status(400).json({ error: 'File upload error: ' + error.message });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }
  
  console.error('Upload route error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Analyze existing products with AI
router.post('/analyze-existing-products', async (req, res) => {
  try {
    console.log('Starting AI analysis of existing products...');
    
    // Get all products that haven't been analyzed yet
    const unanalyzedProducts = await Product.find({ aiAnalyzed: { $ne: true } });
    
    if (unanalyzedProducts.length === 0) {
      return res.json({ 
        message: 'All products have already been analyzed',
        analyzedCount: 0,
        totalProducts: await Product.countDocuments()
      });
    }

    console.log(`Found ${unanalyzedProducts.length} products to analyze`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process products in batches to avoid overwhelming the API
    for (let i = 0; i < unanalyzedProducts.length; i++) {
      const product = unanalyzedProducts[i];
      
      try {
        console.log(`Analyzing product ${i + 1}/${unanalyzedProducts.length}: ${product.name}`);
        
        let imageInput;
        
        // Handle different image formats
        if (product.imageUrl.startsWith('data:')) {
          // Base64 data URL format
          const base64Data = product.imageUrl.split(',')[1];
          imageInput = Buffer.from(base64Data, 'base64');
        } else if (product.imageUrl.startsWith('http')) {
          // External URL format (like Unsplash)
          imageInput = product.imageUrl;
        } else {
          console.warn(`Skipping product ${product.name} - unsupported image format`);
          errorCount++;
          continue;
        }

        // Analyze with Gemini AI
        const analysisResult = await analyzeImageWithGemini(imageInput);

        // Update the product with AI analysis
        product.aiAnalysis = analysisResult.success ? analysisResult.analysis : {
          productName: product.name,
          category: product.category,
          description: 'AI analysis failed',
          keyFeatures: [],
          colors: [],
          style: 'unknown',
          material: 'unknown',
          tags: []
        };
        product.aiRawResponse = analysisResult.rawResponse || '';
        product.aiAnalyzed = true;

        await product.save();
        
        if (analysisResult.success) {
          successCount++;
          console.log(`✓ Successfully analyzed: ${product.name}`);
        } else {
          errorCount++;
          errors.push(`${product.name}: ${analysisResult.error}`);
          console.warn(`✗ Failed to analyze: ${product.name}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errorCount++;
        errors.push(`${product.name}: ${error.message}`);
        console.error(`Error analyzing product ${product.name}:`, error);
      }
    }

    res.json({
      message: 'AI analysis completed',
      totalProcessed: unanalyzedProducts.length,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // Limit error details
      totalProducts: await Product.countDocuments({ aiAnalyzed: true })
    });

  } catch (error) {
    console.error('Error analyzing existing products:', error);
    res.status(500).json({ error: 'Failed to analyze existing products' });
  }
});

module.exports = router;
