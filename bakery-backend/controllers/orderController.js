const Order = require("../models/Order")
const Product = require("../models/product")

// POST create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      deliveryAddress,
      deliverySlot,
      couponCode,
      discount
    } = req.body

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      deliveryAddress,
      deliverySlot,
      couponCode,
      discount
    })

    // DECREASE STOCK FOR EACH PRODUCT
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }  // decrease stock by quantity ordered
      )
    }

    res.status(201).json(order)
  } catch (err) {
     console.log("Order creation error:", err)
    res.status(500).json({ message: err.message })
  }
}

// GET my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
}