const {measurementDB} = require('../data-access-mongoose');

const makeListMeasurement = require('./list-measurement');
const listMeasurement = makeListMeasurement({measurementDB});

const makeCreateMeasurement = require('./create-measurement');
const createMeasurement = makeCreateMeasurement({measurementDB});

module.exports = Object.freeze({
  listMeasurement,
  createMeasurement,
})