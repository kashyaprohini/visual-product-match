const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageHash: {
    type: String,
    required: true
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // GridFS file ID for stored images
  },
  imagePath: {
    type: String,
    required: false // Local file path for disk storage
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ imageHash: 1 });

module.exports = mongoose.model('Product', productSchema);
