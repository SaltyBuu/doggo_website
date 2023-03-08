const express = require('express');
const app = express();
const PORT = 3000;

app.use('/', require('./routes/router.js'));

module.exports = app;
