const sharp = require('sharp');

/**
 * Calculate perceptual hash of an image using the average hash algorithm
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<string>} - 64-bit hash as hexadecimal string
 */
async function calculatePerceptualHash(imageBuffer) {
  try {
    // Resize to 8x8 grayscale image
    const { data } = await sharp(imageBuffer)
      .resize(8, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate average pixel value
    const pixelArray = Array.from(data);
    const average = pixelArray.reduce((sum, pixel) => sum + pixel, 0) / pixelArray.length;

    // Create hash based on whether each pixel is above or below average
    let hash = '';
    for (let i = 0; i < pixelArray.length; i++) {
      hash += pixelArray[i] >= average ? '1' : '0';
    }

    // Convert binary string to hexadecimal
    let hexHash = '';
    for (let i = 0; i < hash.length; i += 4) {
      const binaryChunk = hash.substring(i, i + 4);
      hexHash += parseInt(binaryChunk, 2).toString(16);
    }

    return hexHash;
  } catch (error) {
    console.error('Error calculating perceptual hash:', error);
    throw new Error('Failed to calculate image hash');
  }
}

/**
 * Calculate Hamming distance between two hashes
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {number} - Hamming distance (0 = identical, higher = more different)
 */
function calculateHammingDistance(hash1, hash2) {
  if (hash1.length !== hash2.length) {
    throw new Error('Hash lengths must be equal');
  }

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }

  return distance;
}

/**
 * Convert hex hash to binary for better comparison
 * @param {string} hexHash - Hexadecimal hash
 * @returns {string} - Binary representation
 */
function hexToBinary(hexHash) {
  return hexHash
    .split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
}

module.exports = {
  calculatePerceptualHash,
  calculateHammingDistance,
  hexToBinary
};
