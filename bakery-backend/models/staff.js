// bakery-backend/models/staff.js
const mongoose = require("mongoose")

const staffSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  role:      { type: String, required: true },
  shift:     { type: String, required: true },
  phone:     { type: String, required: true },
  status:    { type: String, enum: ["active", "off"], default: "active" }
}, { timestamps: true })

module.exports = mongoose.models.Staff || mongoose.model("Staff", staffSchema)