const axios = require('axios');
const {
  DB,
  measurementDB,
} = require('../data-access-mongoose');
const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');
// const makeListMeasurement = require('./list-measurement');


describe('simulate API GET call', () => {


  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({})
    DB.connection.close();
  });


  it('should be able to GET data', async () => {

    // generate fake data
    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();
    await measurementDB().create(mock);

    // GET the data
    axios.get(`http://localhost:${process.env.API_PORT}/measurement`)
      .then(response => {
        expect(response.data.success).toBe(true);
      });


  });




});