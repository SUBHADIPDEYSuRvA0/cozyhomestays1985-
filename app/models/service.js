const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
   servicerate: {
      type: Number,
      required: true,
   }
});

module.exports = mongoose.model("Service", serviceSchema);