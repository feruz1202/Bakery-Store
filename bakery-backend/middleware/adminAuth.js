// bakery-backend/middleware/adminAuth.js

const jwt = require("jsonwebtoken")

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Access denied. Not an admin." })
    }

    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or has expired." })
  }
}

module.exports = adminAuth