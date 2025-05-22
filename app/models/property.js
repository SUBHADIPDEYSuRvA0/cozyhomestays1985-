const mongoose = require("mongoose");
const category = require("./category");
const user = require("./user");

const Schema = mongoose.Schema;


const propertyCategorySchema={
   categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    propertyId: {
        type: String,    
        required: true,
    },
}

module.exports = mongoose.model("PropertyCategory", propertyCategorySchema);