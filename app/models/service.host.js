const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const serviceHostSchema = new Schema({
    servicerate: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("ServiceHost", serviceHostSchema);