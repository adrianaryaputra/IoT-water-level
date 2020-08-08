'use strict';
require('dotenv').config()

// imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Joi = require('joi');
const mongoose = require('mongoose');

// DB settings
mongoose.set('useFindAndModify', false);

// DB init
mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
},(err) => {
    if(err) console.log(err);
});

// API init
const app = express()
app.use(bodyParser.json());
app.use(cors());

// routes
app.use("/record", require('./measurement/measurement.router'));
app.use("/device", require('./sensor/sensor.router'));

app.listen(process.env.API_PORT, () => {
  console.log(`listening on port ${process.env.API_PORT}`);
});