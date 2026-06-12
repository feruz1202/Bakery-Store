require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("./models/Product")

const products = [
  {
    name: "Classic Sourdough",
    description: "Slow-fermented 48h, heritage wheat, perfect crust",
    price: 6.50,
    category: "bread",
    badge: "Bestseller",
    image: "/sourdough.jpg",
    inStock: true
  },
  {
    name: "Butter Croissant",
    description: "French laminated dough, pure Irish butter, 72 layers",
    price: 3.20,
    category: "pastry",
    badge: "Popular",
    image: "/crossaint.jpg",
    inStock: true
  },
  {
    name: "Cupcake",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 4.80,
    category: "cake",
    badge: "Seasonal",
    image: "/cupcake.jpg",
    inStock: true
  },
   // ADD NEW PRODUCTS HERE
  {
    name: "Lemon Tart",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 4.80,
    category: "cake",
    badge: "Seasonal",
    image: "/lemontart.jpg",
    inStock: true
  },
  // add all your other products here same structure
]

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected!")
    await Product.deleteMany()
    console.log("Old products deleted!")
    await Product.insertMany(products)
    console.log("Products seeded successfully!")
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })