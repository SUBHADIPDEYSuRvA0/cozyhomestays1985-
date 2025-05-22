const mongoose = require('mongoose');

const PropertyAddressSchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  nearby: { type: String },
  mapAddress: { type: String },      // The "Full Address" input with id="mapAddress"
  fullAddress: { type: String },     // The other "Full Address" input with id="fullAddress"
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
   propertyId: {
        type: String,    
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('PropertyAddress', PropertyAddressSchema);