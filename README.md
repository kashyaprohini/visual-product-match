# Visual Product Matcher

A modern web application that uses AI-powered visual similarity matching to find similar products based on uploaded images. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and features a decoupled architecture with perceptual hashing for image comparison.

## 🚀 Features

- **Image Upload**: Drag-and-drop or click-to-upload interface
- **Visual Similarity Matching**: Uses perceptual hashing to find similar products
- **Real-time Results**: Fast similarity scoring with Hamming distance calculation
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Similarity Filtering**: Adjustable slider to filter results by similarity score
- **Loading States**: Smooth loading indicators and error handling
- **Modern UI**: Clean, professional interface with hover effects and animations

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Sharp** for image processing
- **Multer** for file upload handling
- **Perceptual Hashing** for image similarity calculation

### Frontend
- **React.js** with Hooks (useState, useEffect)
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

## 📁 Project Structure

```
Visual Product Matcher/
├── server/                 # Backend API
│   ├── models/
│   │   └── Product.js     # MongoDB Product schema
│   ├── scripts/
│   │   └── seedDatabase.js # Database seeding script
│   ├── utils/
│   │   └── imageUtils.js  # Image processing utilities
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Express server
└── client/                # React frontend
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── services/      # API service layer
    │   ├── App.jsx        # Main application component
    │   ├── main.jsx       # React entry point
    │   └── index.css      # Global styles
    ├── package.json
    └── vite.config.js     # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd "Visual Product Matcher"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visual-product-matcher
NODE_ENV=development
```

### 3. Database Setup
```bash
# Make sure MongoDB is running, then seed the database
cd server
npm run seed
```

### 4. Start the Application
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend development server
cd client
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 How It Works

### Perceptual Hashing Algorithm
1. **Image Processing**: Uploaded images are resized to 8x8 grayscale
2. **Average Calculation**: Calculate the average pixel value
3. **Binary Hash**: Create a 64-bit binary hash based on pixel comparisons
4. **Hex Conversion**: Convert to hexadecimal for efficient storage

### Similarity Matching
1. **Hash Comparison**: Calculate Hamming distance between hashes
2. **Scoring**: Lower scores indicate higher similarity (0 = identical)
3. **Ranking**: Results sorted by similarity score
4. **Filtering**: Client-side filtering based on similarity threshold

## 🎯 API Endpoints

### `GET /api/health`
Check server status

### `GET /api/products`
Get all products (without image hashes)

### `POST /api/products/find-similar`
Find similar products by uploading an image
- **Body**: FormData with 'image' file
- **Returns**: Array of similar products with similarity scores

## 🗄 Database Schema

### Product Model
```javascript
{
  name: String,           // Product name
  category: String,       // Product category
  imageUrl: String,       // Image URL
  imageHash: String,      // Perceptual hash (hex)
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

## 🎨 Frontend Components

- **App**: Main application container with state management
- **Header**: Application header with branding
- **ImageUploader**: Drag-and-drop image upload component
- **ProductCard**: Individual product display card
- **ResultsList**: Grid layout for product results
- **SimilarityFilter**: Range slider for filtering results
- **LoadingSpinner**: Loading state indicator
- **ErrorMessage**: Error display component

## 🔧 Development Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample products
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🚀 Deployment Considerations

### Backend Deployment
- Set production environment variables
- Configure MongoDB connection string
- Set up proper CORS origins
- Enable compression and security middleware

### Frontend Deployment
- Update API base URL for production
- Build optimized production bundle
- Configure web server for SPA routing
- Set up CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## � Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NODE_ENV`: `production`
     - `PORT`: `5000` (or leave empty for auto-assignment)

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com/api`)

### Environment Variables Setup

**Server (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visual-product-matcher
NODE_ENV=production
```

**Client (.env.production)**:
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

## �🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**Image Processing Errors**
- Check Sharp library installation
- Verify image file formats
- Ensure sufficient memory

**CORS Issues**
- Verify frontend and backend URLs
- Check CORS configuration
- Ensure proper headers

**Slow Similarity Matching**
- Consider database indexing
- Optimize image processing
- Implement caching strategies
