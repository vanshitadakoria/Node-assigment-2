const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            req.session.userId = user._id;
            res.redirect('/students');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Unable to log out');
        res.redirect('/login');
    });
});

module.exports = router;
