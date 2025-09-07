const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { calculatePerceptualHash, calculateHammingDistance } = require('../utils/imageUtils');

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

// Find similar products endpoint
router.post('/products/find-similar', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Calculate perceptual hash of uploaded image
    const uploadedImageHash = await calculatePerceptualHash(req.file.buffer);

    // Get all products from database
    const allProducts = await Product.find();

    // Calculate similarity scores
    const similarityResults = allProducts.map(product => {
      const hammingDistance = calculateHammingDistance(uploadedImageHash, product.imageHash);
      return {
        _id: product._id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        similarity_score: hammingDistance,
      };
    });

    // Sort by similarity score (lower is better) and get top 10
    const topSimilarProducts = similarityResults
      .sort((a, b) => a.similarity_score - b.similarity_score)
      .slice(0, 10);

    res.json(topSimilarProducts);
  } catch (error) {
    console.error('Error finding similar products:', error);
    res.status(500).json({ error: 'Failed to find similar products' });
  }
});

// Upload new product with image (stored as Base64 in MongoDB)
router.post('/upload-product', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { name, category } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    // Calculate perceptual hash from the buffer
    const imageHash = await calculatePerceptualHash(req.file.buffer);

    // Convert image to Base64 for storage in MongoDB
    const imageBase64 = req.file.buffer.toString('base64');
    const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Create new product with Base64 image data
    const product = new Product({
      name,
      category,
      imageUrl: imageDataUrl, // Store as data URL
      imageHash
    });

    await product.save();

    res.status(201).json({
      message: 'Product uploaded successfully',
      product: {
        _id: product._id,
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl
      }
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

module.exports = router;
