const express = require('express');
const logger = require('./logger');
const app = express();
app.use(logger.dev, logger.combined);

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);
  next();
});

app.use('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use('/', require('./routes/router.js'));
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

module.exports = app;
