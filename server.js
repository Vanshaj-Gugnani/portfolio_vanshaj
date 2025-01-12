const express = require('express');
const app = express();
const path = require('path');

const axios = require('axios');
require('dotenv').config();
// Set up static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
// Set view engine to EJS
app.set('view engine', 'ejs');
const nodemailer = require('nodemailer');
app.use(express.urlencoded({ extended: true }));
// Basic route
app.get('/', (req, res) => {
  res.render('index');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vanshajgugnani@gmail.com', // Your Gmail address
    pass: 'wnyj jyml qmyb iahf'     // Your Gmail app password
  }
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

    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Message received and email notification sent' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process message' 
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
