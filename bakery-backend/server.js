const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://192.168.1.9:5173", "https://bakery-backend-production-cc5e.up.railway.app", "https://https://https://bakery-store-k5lqjow11-feruz1202s-projects.vercel.app", "https://bakery-store.vercel.app", "https://https://bakery-store-six.vercel.app/"],
  credentials: true
}))
app.use(express.json())

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