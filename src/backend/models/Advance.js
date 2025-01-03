const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema({
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: "Barber", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

module.exports = mongoose.model("Advance", AdvanceSchema);
