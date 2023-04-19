// require('mandatoryenv').load(['PORT']);
const dotenv = require("dotenv");
dotenv.config();
const { PORT } = process.env;

// Instantiate an Express Application
const app = require("./app");
// Open Server on selected Port
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

if (typeof PhusionPassenger !== "undefined") {
  app.listen("passenger");
} else {
  app.listen(3000);
}
