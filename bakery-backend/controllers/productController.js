const Product = require("../models/product")

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, inStock } = req.query

    let filter = {}

    if (category) filter.category = category
    if (inStock) filter.inStock = inStock === "true"
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(filter)
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST create product (admin only)
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    const saved = await product.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}