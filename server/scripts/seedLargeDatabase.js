const mongoose = require('mongoose');
const axios = require('axios');
const fs =require('fs');
require('dotenv').config();

const Product = require('../models/Product');
const { calculatePerceptualHash } = require('../utils/imageUtils');

// Define categories and sample names
const categories = {
  Animals: ['Dog', 'Cat', 'Elephant', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Rabbit', 'Deer'],
  Humans: ['Person', 'Man', 'Woman', 'Child', 'Athlete', 'Musician', 'Artist', 'Doctor', 'Chef', 'Dancer'],
  Gadgets: ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Camera', 'Drone', 'Mouse', 'Keyboard', 'Monitor'],
  Media: ['Book', 'Magazine', 'Newspaper', 'DVD', 'Vinyl', 'Film', 'Poster', 'Artwork', 'Painting', 'Photograph'],
  Food: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Pizza', 'Burger', 'Sandwich', 'Salad', 'Soup'],
  Nature: ['Tree', 'Flower', 'Mountain', 'River', 'Ocean', 'Cloud', 'Forest', 'Desert', 'Island', 'Waterfall']
};

/**
 * A robust function to get an image URL from Unsplash.
 * If it hits a rate limit (403), it will automatically pause for an hour and retry.
 */
async function getImageUrlFromUnsplash(query) {
  const url = 'https://api.unsplash.com/photos/random';
  let attempts = 0;

  while (true) { // This loop will continue until we get a URL
    try {
      const response = await axios.get(url, {
        params: { query: query, orientation: 'squarish' },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
      });
      return response.data.urls.regular; // Success! Exit the loop and return the URL.
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('\n\n--- RATE LIMIT HIT ---');
        console.log('The script will now pause for 1 hour to allow the API limit to reset.');
        console.log(`Will resume automatically at: ${new Date(Date.now() + 3601 * 1000).toLocaleTimeString()}`);
        console.log('You can leave this script running in the background.');
        
        await new Promise(resolve => setTimeout(resolve, 3601 * 1000)); // Wait for 1 hour and 1 second
        console.log('\nResuming script...');
        // The loop will now continue, retrying the failed request.
        continue;
      }
      
      // For other errors (like network issues), retry a few times before giving up.
      attempts++;
      if (attempts >= 3) {
        console.error(`\nFailed to get image URL for "${query}" after 3 attempts due to non-rate-limit error: ${error.message}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before a standard retry
    }
  }
}

/**
 * Downloads an image from a given URL.
 */
async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`\nFailed to download image from URL ${url}:`, error.message);
    return null;
  }
}

async function seedLargeDatabase() {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error('FATAL ERROR: UNSPLASH_ACCESS_KEY is not defined in your .env file.');
    return;
  }
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // console.log('Clearing existing products...');
    // await Product.deleteMany({});
    // console.log('Existing products cleared');

    const totalProductsToSeed = 300;
    console.log(`Starting to seed database with ${totalProductsToSeed} products...`);
    const log = [];

    for (let i = 0; i < totalProductsToSeed; i++) {
      const categoryKeys = Object.keys(categories);
      const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const names = categories[randomCategory];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const productName = `${randomName}`;

      const imageUrl = await getImageUrlFromUnsplash(randomName);
      if (!imageUrl) {
        log.push(`Error: ${productName} - Could not fetch URL from Unsplash.`);
        continue;
      }

      const imageBuffer = await downloadImage(imageUrl);
      if (!imageBuffer) {
        log.push(`Error: ${productName} - Failed to download image from ${imageUrl}.`);
        continue;
      }
      
      const imageHash = await calculatePerceptualHash(imageBuffer);
      
      const productDoc = new Product({
        name: productName,
        category: randomCategory,
        imageUrl: imageUrl,
        imageHash: imageHash
      });
      await productDoc.save();
      const message = `(${i + 1}/${totalProductsToSeed}) Uploaded: ${productName} (${randomCategory})`;
      log.push(message);
      process.stdout.write(`\r${message}`);
    }

    console.log(`\n\nDatabase seeding completed!`);
    fs.writeFileSync('seedLog.txt', log.join('\n'));
    console.log('Log written to seedLog.txt');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

if (require.main === module) {
  seedLargeDatabase();
}

module.exports = { seedLargeDatabase };