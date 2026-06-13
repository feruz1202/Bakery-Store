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
    image: "./sourdough.jpg",
    inStock: true
  },
  {
    name: "Butter Croissant",
    description: "French laminated dough, pure Irish butter, 72 layers",
    price: 3.20,
    category: "pastry",
    badge: "Popular",
    image: "./crossaint.jpg",
    inStock: true
  },
  {
    name: "Cupcake",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 5.80,
    category: "cake",
    badge: "Seasonal",
    image: "./cupcake.jpg",
    inStock: true
  },
  {
    name: "Berry Cake",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 12.80,
    category: "cake",
    badge: "Seasonal",
    image: "./berry-cake.jpg",
    inStock: true
  },
  {
    name: "Bread",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 2.50,
    category: "bread",
    badge: "Seasonal",
    image: "./bread.jpg",
    inStock: true
  },
  {
    name: "Lime Mojito",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 7.50,
    category: "drink",
    badge: "Seasonal",
    image: "./lime-mojito.jpg",
    inStock: true
  },
  {
    name: "Pie",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 9.99,
    category: "cookie",
    badge: "Seasonal",
    image: "./pie.jpg",
    inStock: true
  },
  {
    name: "Pastries",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 11.50,
    category: "pastry",
    badge: "Seasonal",
    image: "./pishiriq.jpg",
    inStock: true
  },
  {
    name: "Round Bread",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 3.80,
    category: "bread",
    badge: "Seasonal",
    image: "./round-bread.jpg",
    inStock: true
  },
  {
    name: "Somsa",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 4.30,
    category: "pastry",
    badge: "Seasonal",
    image: "./somsa.jpg",
    inStock: true
  },
  {
    name: "Tropical Cocktail",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 6.90,
    category: "drink",
    badge: "Seasonal",
    image: "./tropical-cocktail.jpg",
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