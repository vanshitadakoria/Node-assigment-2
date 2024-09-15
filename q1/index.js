const express = require('express');
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express()

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', 'views'); 

var options = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type, only JPEG is allowed!'), false); 
    }
};

const upload = multer({
    storage: options,
    fileFilter: fileFilter
})

mongoose.connect('mongodb://0.0.0.0:27017/filedb')
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

app.get('/register', (req, res) => {
    res.render('register'); 
  });
app.post('/register', upload.array('files', 3), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const files = req.files;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (files.length === 0) {
            return res.status(400).json({ message: 'At least one file is required' });
        }

        const newUser = new User({
            name,
            email,
            password,
            files : files.map(file => file.path)
        })

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/files', async (req, res) => {
    try {
        const users = await User.find().exec();
        const files = users.flatMap(user =>
            user.files.map(filepath => ({
                user: {
                    name: user.name,
                    email: user.email
                },
                filepath: filepath
            }))
        );
        res.render('files', { files });
    } catch (err) {
        res.status(500).send('Error retrieving files from database');
    }
});

app.get('/download/*', async (req, res) => {
    const filepath = decodeURIComponent(req.params[0]);  
    try {
        const fullPath = path.join(__dirname, filepath);
        if (fs.existsSync(fullPath)) {
            res.download(fullPath, err => {
                if (err) {
                    console.log(err);
                    res.status(404).send('File not found');
                }
            });
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})