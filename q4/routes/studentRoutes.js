const express = require('express');
const router = express.Router();
const Student = require('../models/student');

function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const students = await Student.find();
        res.render('listStudent', { students });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('addStudent');
});

router.post('/add', ensureAuthenticated, async (req, res) => {
    const { name, age, grade } = req.body;
    try {
        const student = new Student({ name, age, grade });
        await student.save();
        res.redirect('/students');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('editStudent', { student });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    const { name, age, grade } = req.body;
    try {
        await Student.findByIdAndUpdate(req.params.id, { name, age, grade });
        res.redirect('/students');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Handle deleting a student (authenticated users only)
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
