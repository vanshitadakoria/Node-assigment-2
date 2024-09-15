const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Ensure path is correct

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/studentdb');

const seedUsers = async () => {
    try {
        // Create a user with a plaintext password
        await User.create({
            username: 'admin',
            password: 'admin123', // Plaintext password
        });

        console.log('User created successfully');
    } catch (err) {
        console.error('Error creating user:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();
