const {
  listMeasurement,
} = require('../use-cases');
const validator = require('../validator');
const makeGetMeasurement = require('./get-measurement');

const getMeasurement = makeGetMeasurement({listMeasurement, validator});

module.exports = Object.freeze({
  getMeasurement,
});