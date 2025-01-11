const express = require('express');
const app = express();
const path = require('path');

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
// Set view engine to EJS
app.set('view engine', 'ejs');

// Basic route
app.get('/', (req, res) => {
  res.render('index');
});



// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
