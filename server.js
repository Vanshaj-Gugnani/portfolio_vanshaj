const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Better to use environment variable
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');

// Set view engine to EJS
app.set('view engine', 'ejs');

const nodemailer = require('nodemailer');

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// Basic route
app.get('/', (req, res) => {
  // Get success status from session
  const success = req.session.success || false;
  
  // Clear the success flag after reading it
  req.session.success = false;
  
  res.render('index', { success });
});

app.post('/send-message', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Email content
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'vanshajgugnani@gmail.com',
      subject: `New Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Set success in session
    req.session.success = true;
    
    res.redirect('/#contact');
  } catch (error) {
    console.error('Error sending email:', error);
    // Optionally set an error message in session
    req.session.error = 'Failed to send message';
    res.redirect('/#contact');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});