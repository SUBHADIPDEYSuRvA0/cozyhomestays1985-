const express = require('express');
const app = express.Router();

app.use('/', require('./admin.pages.routes'));
app.use('/category', require('./admin.category'));
app.use('/aminities', require('./aminities.routes'));
app.use('/gst', require('./gstslab.routes'));
app.use('/service', require('./admin.service'));
app.use('/servicehost', require('./admin.service.host'));
module.exports = app;
