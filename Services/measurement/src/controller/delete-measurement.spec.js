const supertest = require('supertest');
const {app, server} = require('..');
const Config = require('../config');

const {
  DB,
  measurementDB,
} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const HTTP_ADDRESS = Config.HTTP_ADDRESS;

describe('simulate API DELETE call', () => {




  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
    server.close();
  });
  
  
  it('should be able to DELETE data with specific mac address', async () => {

    // generate fake data
    var mock = fakeMeasurement({timestamp: new Date()});
    await measurementDB().create(mock);
    mock.timestamp = mock.timestamp.toISOString();

    // GET the data
    return supertest(app)
      .delete(HTTP_ADDRESS)
      .query({
        mac_address: mock.mac_address,
      })
      .expect(200)

  });




});