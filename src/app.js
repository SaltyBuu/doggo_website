const express = require("express");
const logger = require("./logger");
const app = express();
app.use(logger.dev, logger.combined);
app.use(express.json());

app.use(express.static("src/public"));
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  console.log("Request URL:", req.originalUrl);
  console.log("Req@uest Type:", req.method);
  next();
});

app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use("/", require("./routes/router.js"));
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Endpoint Not Found" });
});
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Why would you broke the server ?');
// });

module.exports = app;
