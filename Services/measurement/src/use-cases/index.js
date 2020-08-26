const {measurementDB} = require('../data-access-mongoose');
const makeListMeasurement = require('./list-measurement');

const listMeasurement = makeListMeasurement({measurementDB})

module.exports = Object.freeze({
  listMeasurement,
})