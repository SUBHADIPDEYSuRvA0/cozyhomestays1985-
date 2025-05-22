const express = require('express');
const app = express.Router();

app.use('/', require('./pages.routes'));
app.use('/auth', require('./host.auth'));



// post routes
app.use('/property', require('./property.routes'));
app.use('/rooms', require('./rooms'));  
app.use('/api', require('./document'));

module.exports = app;