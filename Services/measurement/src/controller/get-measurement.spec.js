const supertest = require('supertest');
const {app, server} = require('..')

const {
  DB,
  measurementDB,
} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const HTTP_ADDRESS = '/measurement';

describe('simulate API GET call', () => {


  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
    server.close();
  });


  it('should be able to GET data', async () => {

    // generate fake data
    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();
    await measurementDB().create(mock);
    mock.timestamp = mock.timestamp.toISOString();

    // GET the data
    return supertest(app)
      .get(HTTP_ADDRESS)
      .then(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.payload).toMatchObject([mock]);
      });

  });


  it('can GET measurement with specific mac address', async () => {

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })
    
    // change mac address of some data
    const dummy_similar_mac = "AA-BB-CC-DD-EE-FF"
    mock[2].mac_address = dummy_similar_mac;
    mock[4].mac_address = dummy_similar_mac;

    // create those data to database
    await measurementDB().create(mock)

    return supertest(app)
      .get(HTTP_ADDRESS)
      .query({mac_address: dummy_similar_mac})
      .then(response => {
        expect(response.body.success).toBe(true);
        response.body.payload.forEach((measurement) => {
          expect(measurement.mac_address).toBe(dummy_similar_mac);
        });
      });

  });


  it('can limit GET measurement result ', async () => {

    const setLimit = 2

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    });

    // create those data to database
    await measurementDB().create(mock)

    return supertest(app)
      .get(HTTP_ADDRESS)
      .query({limit: setLimit})
      .then(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.payload.length).toBe(Math.min(setLimit, 5));
      });

  });


  it('can GET measurement result after certain date ', async () => {

    const setDate = new Date('1990-01-01');

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    });

    // create those data to database
    await measurementDB().create(mock)

    return supertest(app)
      .get(HTTP_ADDRESS)
      .query({date_from: setDate})
      .then(response => {
        expect(response.body.success).toBe(true);
        response.body.payload.forEach(measurement => {
          const measurementDate = new Date(measurement.timestamp);
          expect( measurementDate >= setDate).toBe(true);
        })
      });

  });


  it('can GET measurement result before certain date ', async () => {

    const setDate = new Date('1990-01-01');

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    });

    // create those data to database
    await measurementDB().create(mock)

    return supertest(app)
      .get(HTTP_ADDRESS)
      .query({date_to: setDate})
      .then(response => {
        expect(response.body.success).toBe(true);
        response.body.payload.forEach(measurement => {
          const measurementDate = new Date(measurement.timestamp);
          expect( measurementDate <= setDate).toBe(true);
        })
      });

  });




});