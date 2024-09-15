const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.render('categories/index', { categories });
});

// GET create category form
router.get('/addCategory', (req, res) => {
    res.render('categories/addCategory');
});

// POST create category
router.post('/', async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.redirect('/categories');
});

// GET edit category form
router.get('/:id/editCategory', async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render('categories/editCategory', { category });
});

// PUT update category
router.put('/:id', async (req, res) => {
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/categories');
});

// DELETE category
router.delete('/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
});

module.exports = router;
