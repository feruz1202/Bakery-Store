const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  dietary: {
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    nutFree: { type: Boolean, default: false }
  }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)