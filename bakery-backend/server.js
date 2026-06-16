const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const xss = require("xss-clean")

const app = express()

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://192.168.1.9:5173", "https://bakery-backend-2yej.onrender.com", "https://bakery-store-k5lqjow11-feruz1202s-projects.vercel.app", "https://bakery-store.vercel.app", "https://bakery-store-six.vercel.app/"],
  credentials: true
}))
app.use(express.json({ limit: "10kb"}))



// ── Rate limiting ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" }
})
app.use(globalLimiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" }
})
app.use("/api/auth", authLimiter)

// ── MongoDB ───────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err))

// ── Routes ────────────────────────────────────────────────
app.use("/api/products", require("./routes/products"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/orders", require("./routes/orders"))

// ── Test route ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Farine & Co. API is running!" })
})

// ── Global error handler (hide stack in production) ───────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message
  })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err))

// Routes
app.use("/api/products", require("./routes/products"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/orders", require("./routes/orders"))

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Farine & Co. API is running!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

