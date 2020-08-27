const {measurementDB, DB} = require('../data-access-mongoose');

const fakeGetQuery = require('../../__test__/fixture/fakeGetQuery');
const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const makeListMeasurement = require('./list-measurement');

const listMeasurement = makeListMeasurement({measurementDB});

describe('simulate request for measurement list', () => {




  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
  });

  
  it('should be able to get data', async () => {

    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();
    await measurementDB().create(mock);

    return listMeasurement({})
      .then(result => {
        expect(result).toMatchObject([mock]);
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

    return listMeasurement({mac_address: dummy_similar_mac})
      .then(result => {
        result.forEach((measurement) => {
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

    return listMeasurement({limit: setLimit})
      .then(result => {
        expect(result.length).toBe(Math.min(setLimit, 5));
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

    return listMeasurement({date_from: setDate})
      .then(result => {
        result.forEach(measurement => {
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

    return listMeasurement({date_to: setDate})
      .then(result => {
        result.forEach(measurement => {
          const measurementDate = new Date(measurement.timestamp);
          expect( measurementDate <= setDate).toBe(true);
        })
      });

  });




});