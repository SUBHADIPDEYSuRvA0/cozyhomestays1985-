const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   seokeywords: [{
        type: String,
        required: true,
    }],
});

module.exports = mongoose.model("Seo", schema);