const express = require("express");
const logger = require("./logger");
const cors = require('cors')
const app = express();
app.use(logger.dev, logger.combined);
app.use(express.json());

app.use(cors())
app.use(express.static("src/public"));
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  console.log("Request URL:", req.originalUrl);
  console.log("Req@uest Type:", req.method);
  next();
});

// Swagger Documentation
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Set JSON content type for responses
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// API route
app.use("/api/v1", require("./routes/router.js"));



// Default response
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Endpoint Not Found" });
});
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Why would you broke the server ?');
// });

module.exports = app;
