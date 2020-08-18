const mongoose = require("mongoose");
const Schema = mongoose.Schema

Sensor = new Schema({
  mac_address: { 
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: process.env.DEFAULT_DEVICE_NAME,
  },
  last_seen: { 
    type: Date,
    default: new Date(0),
  },
  location: {
    lat: {
      type: Number,
      default: 0,
    },
    long: {
      type: Number,
      default: 0,
    }
  },
  update_time: {
    type: Number,
    required: true,
  },
  pipe_length: {
    type: Number,
    default: process.env.DEFAULT_PIPE_LENGTH,
  },
  alarm: {
    siaga4: {
      type: Number,
      default: process.env.DEFAULT_PIPE_LENGTH,
    },
    siaga3: {
      type: Number,
      default: process.env.DEFAULT_PIPE_LENGTH,
    },
    siaga2: {
      type: Number,
      default: process.env.DEFAULT_PIPE_LENGTH,
    },
    siaga1: {
      type: Number,
      default: process.env.DEFAULT_PIPE_LENGTH,
    },
    evakuasi: {
      type: Number,
      default: process.env.DEFAULT_PIPE_LENGTH,
    },
  }
});

module.exports = mongoose.model("sensor",Sensor)