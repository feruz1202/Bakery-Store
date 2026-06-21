// bakery-backend/routes/adminRoutes.js

const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const adminAuth = require("../middleware/adminAuth")
const Staff = require("../models/staff")

// ── POST /api/admin/login ─────────────────────────────────────────────────────
// The dashboard login form hits this endpoint.
// We compare email+password against your .env values.
// If they match, we return a JWT token. The dashboard stores it in sessionStorage.
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." })
        }

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Incorrect email or password." })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "8h" })
        res.json({ token })
    } catch (err) {
        res.status(500).json({ message: "Server error during login." })
    }
})

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
// Overview page numbers and chart data.
// Uses "totalPrice" (your Order model field name, not totalAmount).
// Uses "createdAt" which exists because your schema has timestamps: true.
router.get("/stats", adminAuth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments()
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()

        const revenueAgg = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ])
        const totalRevenue = revenueAgg[0]?.total || 0

        const year = new Date().getFullYear()

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: "delivered",
                    createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                }
            },
            { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$totalPrice" } } },
            { $sort: { _id: 1 } }
        ])

        const ordersPerMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                }
            },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])

        const outOfStock = await Product.countDocuments({
            $or: [{ inStock: false }, { stock: 0 }]
        })
        const stockAgg = await Product.aggregate([
            { $group: { _id: null, totalUnits: { $sum: "$stock" } } }
        ])
        const totalUnits = stockAgg[0]?.totalUnits || 0

        res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, outOfStock, monthlyRevenue, ordersPerMonth, totalUnits })
    } catch (err) {
        console.error("Stats error:", err)
        res.status(500).json({ message: "Failed to load stats." })
    }
})

// ── GET /api/admin/orders ─────────────────────────────────────────────────────
// Returns all orders newest first.
// .populate("user") gives us firstName, lastName, email from the User collection.
router.get("/orders", adminAuth, async (req, res) => {
    try {
        const { status } = req.query
        const filter = {}
        if (status && status !== "all") filter.status = status

        const orders = await Order.find(filter)
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 })

        res.json(orders)
    } catch (err) {
        console.error("Orders error:", err)
        res.status(500).json({ message: "Failed to load orders." })
    }
})

// ── GET /api/admin/orders/:id ─────────────────────────────────────────────────
// Single order — used when admin clicks "View" to open the detail modal.
// Populates both user and each item's product reference.
router.get("/orders/:id", adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "firstName lastName email createdAt")
            .populate("items.product", "name price image category")

        if (!order) return res.status(404).json({ message: "Order not found." })
        res.json(order)
    } catch (err) {
        console.error("Single order error:", err)
        res.status(500).json({ message: "Failed to load order." })
    }
})

// ── PATCH /api/admin/orders/:id/status ───────────────────────────────────────
// The admin picks a status in the modal and clicks Save.
// Body: { "status": "confirmed" }
// Allowed values match your Order model enum exactly:
//   pending | confirmed | preparing | delivered | cancelled
router.patch("/orders/:id/status", adminAuth, async (req, res) => {
    try {
        const { status } = req.body
        const allowed = ["pending", "confirmed", "preparing", "delivered", "cancelled"]

        if (!allowed.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${allowed.join(", ")}` })
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("user", "firstName lastName email")

        if (!order) return res.status(404).json({ message: "Order not found." })
        res.json(order)
    } catch (err) {
        console.error("Status update error:", err)
        res.status(500).json({ message: "Failed to update status." })
    }
})

// ── GET /api/admin/products ───────────────────────────────────────────────────
// Returns all products from your database (seeded via seed.js).
// Your Product fields: name, description, price, category, badge,
//   image, inStock (boolean), dietary, timestamps.
router.get("/products", adminAuth, async (req, res) => {
    try {
        const { search } = req.query
        const filter = {}
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        }
        const products = await Product.find(filter).sort({ category: 1, name: 1 })
        res.json(products)
    } catch (err) {
        console.error("Products error:", err)
        res.status(500).json({ message: "Failed to load products." })
    }
})

// ── PATCH /api/admin/products/:id/stock ──────────────────────────────────────
// Toggles inStock true/false. Called when admin clicks the stock badge in the table.
// Body: { "inStock": false }
router.patch("/products/:id/stock", adminAuth, async (req, res) => {
    try {
        const { inStock } = req.body
        if (typeof inStock !== "boolean") {
            return res.status(400).json({ message: "inStock must be true or false." })
        }
        const product = await Product.findByIdAndUpdate(req.params.id, { inStock }, { new: true })
        if (!product) return res.status(404).json({ message: "Product not found." })
        res.json(product)
    } catch (err) {
        console.error("Stock update error:", err)
        res.status(500).json({ message: "Failed to update stock." })
    }
})

// ── GET /api/admin/users ──────────────────────────────────────────────────────
// Returns all customers (role: "customer") with order count and total spent.
// Your User model has firstName and lastName as separate fields.
router.get("/users", adminAuth, async (req, res) => {
    try {
        const users = await User.find({ role: "customer" }, "firstName lastName email createdAt").sort({ createdAt: -1 })

        const usersWithStats = await Promise.all(
            users.map(async (u) => {
                const orders = await Order.find({ user: u._id })
                const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                return {
                    _id: u._id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    joined: u.createdAt,
                    orderCount: orders.length,
                    totalSpent
                }
            })
        )

        res.json(usersWithStats)
    } catch (err) {
        console.error("Users error:", err)
        res.status(500).json({ message: "Failed to load users." })
    }
})

// ── GET /api/admin/staff ──────────────────────────────────────────────────────
router.get("/staff", adminAuth, async (req, res) => {
    try {
        const staff = await Staff.find().sort({ createdAt: -1 })
        res.json(staff)
    } catch (err) {
        res.status(500).json({ message: "Failed to load staff." })
    }
})

// ── POST /api/admin/staff ─────────────────────────────────────────────────────
router.post("/staff", adminAuth, async (req, res) => {
    try {
        const { firstName, lastName, role, shift, phone, status } = req.body
        if (!firstName || !lastName || !role || !shift || !phone) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const member = await Staff.create({ firstName, lastName, role, shift, phone, status: status || "active" })
        res.status(201).json(member)
    } catch (err) {
        res.status(500).json({ message: "Failed to add staff member." })
    }
})

// ── PATCH /api/admin/staff/:id ────────────────────────────────────────────────
router.patch("/staff/:id", adminAuth, async (req, res) => {
    try {
        const { firstName, lastName, role, shift, phone, status } = req.body
        const member = await Staff.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, role, shift, phone, status },
            { new: true }
        )
        if (!member) return res.status(404).json({ message: "Staff member not found." })
        res.json(member)
    } catch (err) {
        res.status(500).json({ message: "Failed to update staff member." })
    }
})

// ── DELETE /api/admin/staff/:id ───────────────────────────────────────────────
router.delete("/staff/:id", adminAuth, async (req, res) => {
    try {
        const member = await Staff.findByIdAndDelete(req.params.id)
        if (!member) return res.status(404).json({ message: "Staff member not found." })
        res.json({ message: "Staff member removed." })
    } catch (err) {
        res.status(500).json({ message: "Failed to remove staff member." })
    }
})

module.exports = router