const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Barber", BarberSchema);
