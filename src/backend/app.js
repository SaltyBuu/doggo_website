const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const environment = process.env.NODE_ENV;
const app = express();
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'img-src': ['https:', 'data:'],
    },
  })
);

app.use(cors());
console.log(environment);
if (environment === 'dev') {
  const staticOptions = {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    },
  };
  app.use(express.static('src/frontend', staticOptions));
}

app.use((req, res, next) => {
  if (req.originalUrl !== '/votes') {
    const parisTimeOptions = {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const parisTime = new Date(Date.now()).toLocaleString('fr-fr', parisTimeOptions);
    console.log('Timestamp: ', parisTime);
    console.log('Request URL:', req.originalUrl);
    console.log('Request Type:', req.method);
  }
  next();
});

// Swagger Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../../swagger_output.json');
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Set JSON content type for responses
app.use('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// API route
app.use('/', require('./routes/router.js'));

// Default response
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.writableEnded) res.status(500).send('Internal server error.');
});

module.exports = app;
