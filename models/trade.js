
const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  ticker: {
    type: String,
    unique: true
  },
  avgBuyPrice: {
    type: Number,
    min: 0
  },
  shares: {
    type: Number,
    min: 0
  }
});

module.exports = mongoose.model("trade", tradeSchema);