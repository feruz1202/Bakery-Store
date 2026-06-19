const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["bread", "pastry", "cake", "cookie", "drink"]
  },
  badge: {
    type: String
  },
  image: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0
  },
  dietary: {
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    nutFree: { type: Boolean, default: false }
  }
}, { timestamps: true })

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema)