const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');


// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/product-catalog')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(methodOverride('_method')); // Override HTTP methods (PUT, DELETE)
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set view engine
app.set('view engine', 'ejs');
app.set('views', 'views');


// Routes
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Home route (optional)
app.get('/', (req, res) => {
    res.redirect('/products');
});

// Error handling (optional)
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
