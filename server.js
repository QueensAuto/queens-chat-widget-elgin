const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for all origins, so your WordPress site can access the script
app.use(cors());

// Serve the widget's JavaScript file
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'widget.js'));
});

app.listen(port, () => {
  console.log(`Chat widget server listening at http://localhost:${port}`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
