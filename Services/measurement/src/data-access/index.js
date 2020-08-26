const mongoose = require('./mongoose.db');

const makeMeasurementDBModel = require('./measurement.model');
const makeMeasurementDB = require('./measurement');
const measurementDBModel = makeMeasurementDBModel({database: mongoose});
const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

module.exports = Object.freeze({
  measurementDB
});