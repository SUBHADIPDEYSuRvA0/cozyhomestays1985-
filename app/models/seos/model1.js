const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g. 'home', 'about', 'property/:id'
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }], // Array of keywords
  canonicalUrl: { type: String }, // Optional: for canonical SEO link
  image: { type: String }, // Optional: OG image URL
  ogTitle: { type: String }, // Optional: Open Graph Title
  ogDescription: { type: String }, // Optional: Open Graph Description
  ogType: { type: String, default: 'website' },
  ogUrl: { type: String },
  ogImage: { type: String },
  twitterCard: { type: String, default: 'summary_large_image' },
  twitterTitle: { type: String },
  twitterDescription: { type: String },
  twitterImage: { type: String },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

seoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Seo', seoSchema);