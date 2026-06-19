const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postcode: String,
    phone: String
  },
  deliverySlot: {
    date: String,
    time: String
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  couponCode: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema)