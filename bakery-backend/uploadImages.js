require("dotenv").config()
const cloudinary = require("cloudinary").v2
const mongoose = require("mongoose")
const Product = require("./models/product")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const imageMap = {
  "/sourdough.jpg": "./public/sourdough.jpg",
  "/crossaint.jpg": "./public/crossaint.jpg",
  "/cupcake.jpg": "./public/cupcake.jpg",
  "/tropical-cocktail.jpg": "./public/tropical-cocktail.jpg",
  "/somsa.jpg": "./public/somsa.jpg",
  "/round-bread.jpg": "./public/round-bread.jpg",
  "/pishiriq.jpg": "./public/pishiriq.jpg",
  "/pie.jpg": "./public/pie.jpg",
  "/lime-mojito.jpg": "./public/lime-mojito.jpg",
  "/employee.jpg": "./public/employee.jpg",
  "/bread.jpg": "./public/bread.jpg",
  "/berry-cake.jpg": "./public/berry-cake.jpg",
  "/about-photo.jpg": "./public/about-photo.jpg",
  "/yeh-xintong-go3DT3PpIw4-unsplash.jpg": "./public/yeh-xintong-go3DT3PpIw4-unsplash.jpg",
  // add all your images here
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected!")

    for (const [oldPath, localPath] of Object.entries(imageMap)) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(localPath, {
          folder: "farineandco",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        })

        // Update product in database with new Cloudinary URL
        await Product.updateOne(
          { image: oldPath },
          { image: result.secure_url }
        )

        console.log(`✅ Uploaded ${oldPath} → ${result.secure_url}`)
      } catch (err) {
        console.log(`❌ Failed ${oldPath}:`, err.message)
      }
    }

    console.log("All images uploaded!")
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })