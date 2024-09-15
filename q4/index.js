const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/studentdb');

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'test12345',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views','views');

app.use('/students', studentRoutes);
app.use('/', authRoutes);
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/students');
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
