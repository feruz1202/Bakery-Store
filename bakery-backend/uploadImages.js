require("dotenv").config()
const cloudinary = require("cloudinary").v2
const mongoose = require("mongoose")
const Product = require("./models/product")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const path = require("path")

const imageMap = {
    "./sourdough.jpg": path.join(__dirname, "../../Bakery Store/public/sourdough.jpg"),
    "./crossaint.jpg": path.join(__dirname, "../../Bakery Store/public/crossaint.jpg"),
    "./cupcake.jpg": path.join(__dirname, "../../Bakery Store/public/cupcake.jpg"),
    "./tropical-cocktail.jpg": path.join(__dirname, "../../Bakery Store/public/tropical-cocktail.jpg"),
    "./somsa.jpg": path.join(__dirname, "../../Bakery Store/public/somsa.jpg"),
    "./round-bread.jpg": path.join(__dirname, "../../Bakery Store/public/round-bread.jpg"),
    "./pishiriq.jpg": path.join(__dirname, "../../Bakery Store/public/pishiriq.jpg"),
    "./pie.jpg": path.join(__dirname, "../../Bakery Store/public/pie.jpg"),
    "./lime-mojito.jpg": path.join(__dirname, "../../Bakery Store/public/lime-mojito.jpg"),
    "./employee.jpg": path.join(__dirname, "../../Bakery Store/public/employee.jpg"),
    "./bread.jpg": path.join(__dirname, "../../Bakery Store/public/bread.jpg"),
    "./berry-cake.jpg": path.join(__dirname, "../../Bakery Store/public/berry-cake.jpg"),
    "./about-photo.jpg": path.join(__dirname, "../../Bakery Store/public/about-photo.jpg"),
    "./yeh-xintong-go3DT3PpIw4-unsplash.jpg": path.join(__dirname, "../../Bakery Store/public/yeh-xintong-go3DT3PpIw4-unsplash.jpg"),
}

const fs = require("fs")
const testPath = path.join(__dirname, "../../Bakery Store/public/sourdough.jpg")
console.log("Test path:", testPath)
console.log("File exists:", fs.existsSync(testPath))

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("MongoDB connected!")
        // Add before the for loop
        const allProducts = await Product.find({}, { name: 1, image: 1 })
        console.log("Current product images:")
        allProducts.forEach(p => console.log(p.name, "→", p.image))

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


console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME)
console.log("Key:", process.env.CLOUDINARY_API_KEY)
console.log("Secret exists:", !!process.env.CLOUDINARY_API_SECRET)