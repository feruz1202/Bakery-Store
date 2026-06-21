const express = require("express")
const router = express.Router()
const { cloudinary, upload } = require("../config/cloudinary")
const { protect, adminOnly } = require("../middleware/auth")

// Upload single image
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete image
router.delete("/", protect, adminOnly, async (req, res) => {
  try {
    const { public_id } = req.body
    await cloudinary.uploader.destroy(public_id)
    res.json({ message: "Image deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router