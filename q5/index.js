const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.static('public'));
mongoose.connect('mongodb://0.0.0.0:27017/jwt-crud-student');

app.use(cors({
  origin: 'http://127.0.0.1:5500', // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/auth', authRoutes);

app.use('/students', studentRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
