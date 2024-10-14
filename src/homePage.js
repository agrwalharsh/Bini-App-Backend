const express = require('express');
const router = express.Router();

// Define the route for the root URL
router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome Page</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to My Node.js Application!</h1>
      </body>
    </html>
  `);
});

// Export the router to use in app.js
module.exports = router;
