const express = require('express');
const logger = require('./logger');
const cors = require('cors');
const app = express();
app.use(logger.dev, logger.combined);
app.use(express.json());

app.use(cors());
const staticOptions = {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
};
app.use(express.static('src/public', staticOptions));
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  console.log('Request URL:', req.originalUrl);
  console.log('Req@uest Type:', req.method);
  next();
});

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Set JSON content type for responses
app.use('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// API route
app.use('/', require('./routes/router.js'));

// Handling errors
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('An error occured' + err.message);
// });

// Default response
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

module.exports = app;
