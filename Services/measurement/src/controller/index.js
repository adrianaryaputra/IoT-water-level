const {
  listMeasurement,
  createMeasurement,
  removeMeasurement,
} = require('../use-cases');

const validator = require('../validator');
const makeGetMeasurement = require('./get-measurement');
const makePostMeasurement = require('./post-measurement');
const makeDeleteMeasurement = require('./delete-measurement');

const getMeasurement = makeGetMeasurement({listMeasurement, validator});
const postMeasurement = makePostMeasurement({createMeasurement, validator});
const deleteMeasurement = makeDeleteMeasurement({removeMeasurement, validator});

module.exports = Object.freeze({
  getMeasurement,
  postMeasurement,
  deleteMeasurement,
});