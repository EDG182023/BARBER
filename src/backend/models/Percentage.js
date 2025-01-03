const mongoose = require("mongoose");

const PercentageSchema = new mongoose.Schema({
  barber: { type: mongoose.Schema.Types.ObjectId, ref: "Barber", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  percentage: { type: Number, required: true },
});

module.exports = mongoose.model("Percentage", PercentageSchema);
