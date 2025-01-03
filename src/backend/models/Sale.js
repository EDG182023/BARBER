const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Campo único para evitar duplicados
  timestamp: { type: Date, required: true },
  barber: { type: String, required: true },
  service: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  photo: { type: String },
  percentage: { type: Number },
  barberEarnings: { type: Number },
  shopEarnings: { type: Number }
});

module.exports = mongoose.model("Sale", SaleSchema);
