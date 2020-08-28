const {measurementDB, DB} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const makeCreateMeasurement = require('./create-measurement');

const createMeasurement = makeCreateMeasurement({measurementDB});


describe('simulate request for measurement list', () => {





  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
  });


  it('should be able to post data', async () => {

    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();
    
    await createMeasurement(mock)

    // accessing DB
    measurementDB()
      .findAll()
      .submit()
      .then(result => {
        expect(result.length).toBe(1)
      });

  });


  it('should reject no timestamp', async () => {

    var mock = fakeMeasurement({timestamp: undefined});
    mock.mac_address = mock.mac_address.toUpperCase();
    
    return createMeasurement(mock)
      .catch(e => {
        expect(e.message).toContain('timestamp')
      });

  });


  it('should reject no mac_address', async () => {

    var mock = fakeMeasurement({
      timestamp: new Date(),
      mac_address: undefined,
    });
    
    return createMeasurement(mock)
      .catch(e => {
        expect(e.message).toContain('mac_address')
      });

  });


  it('should reject no measurement', async () => {

    var mock = fakeMeasurement({
      timestamp: new Date(),
      measurement: undefined,
    });
    mock.mac_address = mock.mac_address.toUpperCase();

    return createMeasurement(mock)
      .catch(e => {
        expect(e.message).toContain('measurement.level')
      });

  });


  it('should reject no lifetime', async () => {

    var mock = fakeMeasurement({
      timestamp: new Date(),
      lifetime: undefined,
    });
    mock.mac_address = mock.mac_address.toUpperCase();

    return createMeasurement(mock)
      .catch(e => {
        expect(e.message).toContain('lifetime')
      });

  });




});