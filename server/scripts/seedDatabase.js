const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Product = require('../models/Product');
const { calculatePerceptualHash } = require('../utils/imageUtils');

// Sample product data with publicly available images
const sampleProducts = [
  // Electronics
  { name: "MacBook Pro 16-inch", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" },
  { name: "iPhone 15 Pro", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop" },
  { name: "Samsung Galaxy S24", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop" },
  { name: "iPad Air", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop" },
  { name: "Dell XPS 13", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" },
  { name: "Sony WH-1000XM4", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop" },
  { name: "Apple Watch Series 9", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop" },
  { name: "Canon EOS R5", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop" },
  { name: "Nintendo Switch", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop" },
  { name: "Gaming Mechanical Keyboard", category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop" },

  // Clothing
  { name: "Classic White T-Shirt", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop" },
  { name: "Blue Denim Jeans", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop" },
  { name: "Black Leather Jacket", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop" },
  { name: "Red Sneakers", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop" },
  { name: "Summer Dress", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop" },
  { name: "Wool Sweater", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop" },
  { name: "Baseball Cap", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop" },
  { name: "Business Suit", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Running Shoes", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { name: "Winter Coat", category: "Clothing", imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=400&fit=crop" },

  // Home & Living
  { name: "Modern Sofa", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" },
  { name: "Coffee Table", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
  { name: "Table Lamp", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Dining Chair", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
  { name: "Decorative Vase", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop" },
  { name: "Wall Mirror", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" },
  { name: "Throw Pillow", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop" },
  { name: "Area Rug", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" },
  { name: "Bookshelf", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Plant Pot", category: "Home & Living", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop" },

  // Sports & Outdoors
  { name: "Mountain Bike", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop" },
  { name: "Hiking Backpack", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop" },
  { name: "Tennis Racket", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop" },
  { name: "Yoga Mat", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
  { name: "Basketball", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop" },
  { name: "Swimming Goggles", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop" },
  { name: "Camping Tent", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=400&fit=crop" },
  { name: "Soccer Ball", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop" },
  { name: "Fishing Rod", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=400&fit=crop" },
  { name: "Dumbbells", category: "Sports & Outdoors", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop" },

  // Books & Media
  { name: "Programming Book", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Fiction Novel", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop" },
  { name: "Cookbook", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop" },
  { name: "Art Book", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Magazine", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop" },
  { name: "DVD Collection", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1489599162842-42e1ee104e2d?w=400&h=400&fit=crop" },
  { name: "Vinyl Record", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
  { name: "Comic Book", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop" },
  { name: "Educational Textbook", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Travel Guide", category: "Books & Media", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop" }
];

async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
    return null;
  }
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    console.log('Starting to seed database with sample products...');
    const processedProducts = [];

    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      console.log(`Processing product ${i + 1}/${sampleProducts.length}: ${product.name}`);

      try {
        // Download image
        const imageBuffer = await downloadImage(product.imageUrl);
        if (!imageBuffer) {
          console.log(`Skipping ${product.name} - failed to download image`);
          continue;
        }

        // Calculate perceptual hash
        const imageHash = await calculatePerceptualHash(imageBuffer);
        console.log(`Calculated hash for ${product.name}: ${imageHash}`);

        // Create product document
        const productDoc = new Product({
          name: product.name,
          category: product.category,
          imageUrl: product.imageUrl,
          imageHash: imageHash
        });

        await productDoc.save();
        processedProducts.push(productDoc);
        console.log(`✓ Saved ${product.name}`);

      } catch (error) {
        console.error(`Error processing ${product.name}:`, error.message);
      }

      // Add small delay to avoid overwhelming the image service
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\nDatabase seeding completed!`);
    console.log(`Successfully processed ${processedProducts.length} products`);
    console.log('Categories:', [...new Set(processedProducts.map(p => p.category))]);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
