const supertest = require('supertest');
const {app, server} = require('..');
const Config = require('../config');

const {
  DB,
  measurementDB,
} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const HTTP_ADDRESS = Config.HTTP_ADDRESS;

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
    var mock = fakeMeasurement();
    mock.mac_address = mock.mac_address.toUpperCase();

    // call POST method
    await supertest(app)
      .post(HTTP_ADDRESS)
      .send(mock)
      .expect(200)

    // check DB 
    measurementDB().findAll().submit()
      .then(result => {
        expect(result.length).toBe(1);
      })

  });


  it('should reject new measurement with no mac_address', async () => {

    // generate fake data
    var mock = fakeMeasurement({
      mac_address: undefined,
    });

    // call POST method
    await supertest(app)
      .post(HTTP_ADDRESS)
      .send(mock)
      .expect(400)
      .then(response => {
        expect(response.body.error).toContain('mac_address');
      })

  });
  
  
  it('should reject new measurement with no lifetime', async () => {

    // generate fake data
    var mock = fakeMeasurement({
      lifetime: undefined,
    });

    // call POST method
    await supertest(app)
      .post(HTTP_ADDRESS)
      .send(mock)
      .expect(400)
      .then(response => {
        expect(response.body.error).toContain('lifetime');
      })

  });


  it('should reject new measurement with no measurement', async () => {

    // generate fake data
    var mock = fakeMeasurement({
      measurement: undefined,
    });

    // call POST method
    await supertest(app)
      .post(HTTP_ADDRESS)
      .send(mock)
      .expect(400)
      .then(response => {
        expect(response.body.error).toContain('measurement');
      })

  });




});