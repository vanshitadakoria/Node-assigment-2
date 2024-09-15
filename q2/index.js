// app.js
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
const port = 3000;

// Configure session middleware
app.use(session({
  store: new FileStore({}),
  secret: 'test1234', // Replace with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Route to set session data
app.get('/set', (req, res) => {
  req.session.user = { name: 'John Doe', age: 30 };
  res.send('Session data has been set');
});

// Route to get session data
app.get('/get', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.send('No session data found');
  }
});

// Route to destroy session
app.get('/destroy', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error destroying session');
    }
    res.send('Session destroyed');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
