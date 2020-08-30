const {
  listMeasurement,
  createMeasurement,
} = require('../use-cases');

const validator = require('../validator');
const makeGetMeasurement = require('./get-measurement');
const makePostMeasurement = require('./post-measurement');

const getMeasurement = makeGetMeasurement({listMeasurement, validator});
const postMeasurement = makePostMeasurement({createMeasurement, validator});

module.exports = Object.freeze({
  getMeasurement,
  postMeasurement,
});