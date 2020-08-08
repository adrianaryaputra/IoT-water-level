const mongoose = require("mongoose");
const Schema = mongoose.Schema

Measurement = new Schema({
  mac_address: { 
    type: String,
    required: true
  },
  timestamp: { 
    type: Date,
    required: true
  },
  measurement: {
    level: {
      type: Number,
      required: true
    },
    temperature: Number,
    humidity: Number,
  },
  lifetime: { 
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("measurement",Measurement)