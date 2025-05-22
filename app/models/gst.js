const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    gstrate:{
    type: String,
    required: true,
    }
});

module.exports = mongoose.model("Gst", schema);