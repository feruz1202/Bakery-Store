const express = require("express")
const router = express.Router()
const Order = require("../models/order") // ← ADD THIS
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController")
const { protect, adminOnly } = require("../middleware/auth")

// ── Non-wildcard routes first ──────────────────────────────────────────────
router.post("/",          protect,              createOrder)
router.get("/myorders",   protect,              getMyOrders)
router.get("/",           protect, adminOnly,   getAllOrders)
router.put("/:id",        protect, adminOnly,   updateOrderStatus)

// ── Wildcard :id routes last ───────────────────────────────────────────────
router.get("/:id",        protect,              getOrderById)

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order)
      return res.status(404).json({ message: "Order not found" })
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" })
    if (!["pending", "confirmed"].includes(order.status))
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" })

    order.status = "cancelled"
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router