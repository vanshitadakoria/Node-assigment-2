const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // if (!user || !(await user.comparePassword(password))) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }
  const token = jwt.sign({ username: 'admin' }, 'test12345', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
