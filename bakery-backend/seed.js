require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("./models/Product")

const products = [
  {
    name: "Classic Sourdough",
    description: "Slow-fermented 48h, heritage wheat, perfect crust",
    price: 10000,
    category: "bread",
    badge: "Bestseller",
    image: "./sourdough.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 46,
  },
  {
    name: "Butter Croissant",
    description: "French laminated dough, pure Irish butter, 72 layers",
    price: 18000,
    category: "pastry",
    badge: "Popular",
    image: "./crossaint.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 53,
  },
  {
    name: "Cupcake",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 25000,
    category: "cake",
    badge: "Seasonal",
    image: "./cupcake.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 12,
  },
  {
    name: "Berry Cake",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 150000,
    category: "cake",
    badge: "Seasonal",
    image: "./berry-cake.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 19,
  },
  {
    name: "Bread",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 5000,
    category: "bread",
    badge: "Seasonal",
    image: "./bread.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 80,
  },
  {
    name: "Lime Mojito",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 35000,
    category: "drink",
    badge: "Seasonal",
    image: "./lime-mojito.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 8,
  },
  {
    name: "Pie",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 120000,
    category: "cookie",
    badge: "Seasonal",
    image: "./pie.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 20,
  },
  {
    name: "Pastries",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 55000,
    category: "pastry",
    badge: "Seasonal",
    image: "./pishiriq.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 35,
  },
  {
    name: "Round Bread",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 7000,
    category: "bread",
    badge: "Seasonal",
    image: "./round-bread.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 100,
  },
  {
    name: "Somsa",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 40000,
    category: "pastry",
    badge: "Seasonal",
    image: "./somsa.jpg",
    inStock: true,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 24,
  },
  {
    name: "Tropical Cocktail",
    description: "Zingy curd, buttery shortcrust, Italian meringue",
    price: 35000,
    category: "drink",
    badge: "Seasonal",
    image: "./tropical-cocktail.jpg",
    inStock: false,
    ingredients: ["Heritage wheat flour", "Water", "Salt", "Sourdough starter"],
    stock: 0,
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