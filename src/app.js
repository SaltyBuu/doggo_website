const express = require('express');
const app = express();
const PORT = 3000;
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    console.log('Request URL:', req.originalUrl)
    console.log('Request Type:', req.method)
    next()
})
app.use('/', require('./routes/router.js'));

module.exports = app;
