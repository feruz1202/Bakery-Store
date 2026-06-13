const jwt = require("jsonwebtoken")
const User = require("../models/user")

// Protect routes — verify token
const protect = async (req, res, next) => {
  try {
    let token

    // check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // get user from token
    req.user = await User.findById(decoded.id).select("-password")

    next()
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as admin" })
  }
}

module.exports = { protect, adminOnly }