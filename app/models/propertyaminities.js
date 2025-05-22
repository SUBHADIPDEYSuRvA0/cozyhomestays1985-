const mongoose = require('mongoose');
const property = require('./property');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  propertyId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 
});

module.exports = mongoose.model('PropertyAminity', propertySchema);