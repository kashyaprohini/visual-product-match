# Visual Product Search

A modern web application that uses **Google Gemini AI** to analyze uploaded product images and find similar products with AI-powered search suggestions. The app provides intelligent image understanding and generates realistic product recommendations with working links and images.

## 🚀 Features

- **🤖 AI-Powered Image Analysis**: Uses Google Gemini Vision AI to understand product features, colors, materials, and style
- **🌐 Smart Product Search**: Generates realistic product suggestions based on image analysis
- **📸 Smart Image Upload**: Drag-and-drop or click-to-upload interface with instant AI analysis
- **🎯 Intelligent Product Matching**: Shows similar products with prices, descriptions, and source links
- **⚡ Real-time Results**: Fast AI analysis with comprehensive product details
- **📱 Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **🔍 Advanced Filtering**: Adjustable similarity threshold with percentage-based scoring
- **💡 Smart Product Insights**: Displays AI-generated product descriptions, categories, and features
- **🛒 Direct Product Links**: Click through to search for products on popular shopping sites

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **Google Gemini AI** for image analysis and product search generation
- **Multer** for file upload handling
- **Axios** for HTTP requests
- **No Database Required** - Uses AI-powered search instead

### Frontend
- **React.js** with Hooks (useState, useEffect)
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### AI Integration
- **Google Generative AI (@google/generative-ai)** for image analysis
- **Gemini 1.5 Flash** model for fast and accurate vision processing
- **AI-generated product recommendations** with realistic details

## 📁 Project Structure

```
Visual Product Search/
├── server/                 # Backend API
│   ├── routes/
│   │   └── imageUpload.js # Image upload and search routes
│   ├── utils/
│   │   └── geminiAI.js    # Gemini AI integration
│   ├── .env.example       # Environment variables template
│   ├── package.json
│   └── server.js          # Express server
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visual-product-search
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

5. **Start the development servers**
   
   Backend (in `server` directory):
   ```bash
   npm run dev
   ```
   
   Frontend (in `client` directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for image analysis | Yes |
| `PORT` | Server port (default: 5000) | No |

## 🎯 How It Works

1. **Image Upload**: User uploads a product image through the web interface
2. **AI Analysis**: Gemini AI analyzes the image to extract:
   - Product name and category
   - Colors, materials, and style
   - Key features and tags
   - Search queries for finding similar products
3. **Product Generation**: AI generates realistic product suggestions with:
   - Similar product names and descriptions
   - Realistic prices and store sources
   - Working placeholder images
   - Direct links to search on popular shopping sites
4. **Results Display**: Shows 5 similar products with:
   - Product images and details
   - Similarity scores (70-95%)
   - Clickable links to search for products online

## 📊 API Endpoints

### POST `/api/products/find-similar`
Upload an image and get similar product suggestions.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
  "uploadedImageAnalysis": {
    "productName": "Nike Running Shoes",
    "category": "footwear",
    "description": "Black and white athletic running shoes",
    "colors": ["black", "white"],
    "style": "athletic",
    "searchQueries": ["Nike running shoes", "athletic footwear"]
  },
  "similarProducts": [
    {
      "name": "Nike Running Shoes - Premium Edition",
      "imageUrl": "https://picsum.photos/400/400?random=1",
      "productUrl": "https://www.amazon.com/s?k=Nike+Running+Shoes",
      "price": "$89.99",
      "source": "Amazon",
      "similarityScore": 92,
      "description": "High-quality footwear with premium features"
    }
  ],
  "searchType": "web_search"
}
```

## 🎨 UI Components

- **ImageUploader**: Drag-and-drop image upload with preview
- **ProductCard**: Individual product display with details and links
- **ResultsList**: Grid layout for search results with web search indicator
- **SimilarityFilter**: Adjustable similarity threshold
- **LoadingSpinner**: Loading states during AI analysis
- **ErrorMessage**: User-friendly error handling

## 🌟 Key Features

### AI-Powered Analysis
- Extracts detailed product information from images
- Identifies colors, materials, style, and key features
- Generates relevant search queries

### Realistic Product Suggestions
- AI-generated product names and descriptions
- Realistic pricing and store information
- Working placeholder images
- Direct links to popular shopping sites

### User-Friendly Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for all devices
- Intuitive drag-and-drop upload
- Real-time feedback and loading states

## 🔮 Future Enhancements

- [ ] Real Google Custom Search API integration
- [ ] User preferences and search history
- [ ] Advanced filtering (price range, brand, etc.)
- [ ] Product comparison features
- [ ] Social sharing capabilities
- [ ] Mobile app version
- [ ] Integration with real e-commerce APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [Google Gemini AI documentation](https://ai.google.dev/)

## 📸 Demo

Upload any product image and watch as the AI analyzes it and generates realistic similar product suggestions with working links to popular shopping sites!

---

**Note**: This application uses AI-generated product suggestions for demonstration purposes. The product links direct to search pages on real shopping sites where users can find actual similar products.
