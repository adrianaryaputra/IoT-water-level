const supertest = require('supertest');
const {app, server} = require('..')

const {
  DB,
  measurementDB,
} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const HTTP_ADDRESS = '/api/v1/measurement';

describe('simulate API POST call', () => {




  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
    server.close();
  });
  
  
  it('should be able to add new measurement to DB', async () => {

    // generate fake data
    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();

    // call POST method
    await supertest(app)
      .post(HTTP_ADDRESS)
      .send(mock)
      .expect(200)
      .then(res => {
        console.log(res.body)
    });

  });




});