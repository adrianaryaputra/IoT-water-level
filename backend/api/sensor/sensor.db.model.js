const mongoose = require("mongoose");
const Schema = mongoose.Schema

Sensor = new Schema({
  mac_address: { 
    type: String,
    required: true
  },
  name: {
    type: String,
    default: process.env.DEFAULT_DEVICE_NAME
  },
  last_seen: { 
    type: Date,
    default: new Date(0)
  },
  location: {
    lat: {
      type: Number,
      default: 0
    },
    long: {
      type: Number,
      default: 0
    }
  },
  update_time: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("sensor",Sensor)