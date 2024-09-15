const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
});

const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
    const products = await Product.find().populate('category');
    res.render('products/index', { products });
});

// GET create product form
router.get('/addProduct', async (req, res) => {
    const categories = await Category.find();
    res.render('products/addProduct', { categories });
});

// POST create product
router.post('/', upload.array('images'), async (req, res) => {
    const { name, price, category } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);
    const product = new Product({ name, price, category, images });
    await product.save();
    res.redirect('/products');
});

// GET edit product form
router.get('/:id/editProduct', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();
    res.render('products/editProduct', { product, categories });
});

// PUT update product
router.put('/:id', upload.array('images'), async (req, res) => {
    const { name, price, category } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);
    await Product.findByIdAndUpdate(req.params.id, { name, price, category, images });
    res.redirect('/products');
});

// DELETE product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
});

module.exports = router;
