require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./models/User")

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected!")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("@Feruz883212008", salt)

    await User.create({
      firstName: "Admin",
      lastName: "Farine",
      email: "admin@feruz1202.com",
      password: hashedPassword,
      role: "admin"
    })

    console.log("Admin created successfully!")
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })