// require('mandatoryenv').load(['PORT']);
const dotenv = require("dotenv");
dotenv.config();
const { PORT } = process.env || 3000;

// Instantiate an Express Application
const app = require("./app");
// Open Server on selected Port
app.listen(PORT, () => console.info("Server listening on port ", PORT));
