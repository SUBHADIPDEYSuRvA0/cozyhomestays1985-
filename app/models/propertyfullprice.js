const mongoose = require('mongoose');
const propertyaminities = require('./propertyaminities');
const Schema = mongoose.Schema;

const occationPriceSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true }
});

const discountSchema = new Schema({
  isActive: { type: Boolean, default: false },
  bookingsLimit: { type: Number, default: 3 },
  percentage: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 }
});

const propertyFullPriceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: String, required: true },
  fullprice: { type: Number, required: true },
  dayWisePrices: { type: Map, of: Number, default: {} },
  occationprice: [occationPriceSchema],
  discount: discountSchema,
  cheakInTime:    { type: Date, required: true },
  cheakOutTime:   { type: Date, required: true },
  propertycategory: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyCategory', required: true },
  propertyListingType: { type: mongoose.Schema.Types.ObjectId, ref: 'ListingType', required: true },
  PropertyPolicy: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyPolicy', required: true },
  fullproperty: { type: mongoose.Schema.Types.ObjectId, ref: 'fullproperty', required: true },
  PropertyAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAddress', required: true },
  propertyaminities: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAminity' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PropertyFullPrice', propertyFullPriceSchema);