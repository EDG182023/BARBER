const mongoose = require("mongoose");

const FixedExpenseSchema = new mongoose.Schema({
   expenseName : { type: String, required: true },
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
  });
  
  module.exports = mongoose.model("FixedExpense", FixedExpenseSchema);
  