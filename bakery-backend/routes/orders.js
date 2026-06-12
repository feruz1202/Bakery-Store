const express = require("express")
const router = express.Router()
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController")
const { protect, adminOnly } = require("../middleware/auth")

// Customer routes
router.post("/", protect, createOrder)
router.get("/myorders", protect, getMyOrders)
router.get("/:id", protect, getOrderById)

// Admin only routes
router.get("/", protect, adminOnly, getAllOrders)
router.put("/:id", protect, adminOnly, updateOrderStatus)

module.exports = router