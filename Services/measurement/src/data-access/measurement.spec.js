const mongoose = require('./mongoose.db');
const faker = require('faker');
const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement')
const fakeGetQuery = require('../../__test__/fixture/fakeGetQuery')

const makeMeasurementDBModel = require('./measurement.model');
const makeMeasurementDB = require('./measurement');

const measurementDBModel = makeMeasurementDBModel({database: mongoose});


describe('measurement database model', ()=> {

  
  beforeEach(async () => {
    await measurementDBModel.deleteMany({})
  });


  afterAll(async () => {
    await measurementDBModel.deleteMany({})
    mongoose.connection.close();
  });


  it('can create new measurement', () => {
    
    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data
    var mock = fakeMeasurement({timestamp: new Date()});
    mock.mac_address = mock.mac_address.toUpperCase();

    // try to create
    return measurementDB.create(mock)
      .then(doc => {
        expect(doc).toMatchObject(mock);
      })

  });


  it('reject incomplete mac address', () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data with invalid measurement
    var mock = fakeMeasurement({
      timestamp: new Date(),
      mac_address: undefined,
    });
    if(mock.mac_address)
      mock.mac_address = mock.mac_address.toUpperCase();

    return measurementDB.create(mock)
      .catch(err => {
        expect(err.message).toContain('mac_address');
      })

  });


  it('reject invalid mac address', () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data with invalid measurement
    var mock = fakeMeasurement({
      timestamp: new Date(),
      mac_address: "some random shit",
    });
    if(mock.mac_address)
      mock.mac_address = mock.mac_address.toUpperCase();

    return measurementDB.create(mock)
      .catch(err => {
        expect(err.message).toContain('mac_address');
      })

  });


  it('reject incomplete timestamp', () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data with invalid measurement
    var mock = fakeMeasurement();
    mock.mac_address = mock.mac_address.toUpperCase();

    return measurementDB.create(mock)
      .catch(err => {
        expect(err.message).toContain('timestamp');
      })

  });


  it('reject incomplete lifetime', () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data with invalid measurement
    var mock = fakeMeasurement({
      timestamp: new Date(),
      lifetime: undefined,
    });
    mock.mac_address = mock.mac_address.toUpperCase();

    return measurementDB.create(mock)
      .catch(err => {
        expect(err.message).toContain('lifetime');
      })

  });


  it('reject incomplete measurement', () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate a random mock data with invalid measurement
    var mock = fakeMeasurement({
      timestamp: new Date(),
      measurement: undefined,
    });
    mock.mac_address = mock.mac_address.toUpperCase();

    return measurementDB.create(mock)
      .catch(err => {
        expect(err.message).toContain('measurement.level');
      })

  });


  it('can create multiple new measurement', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    const mock = Array.from({length:3}).map(() => {
      var f = fakeMeasurement({timestamp: new Date()});
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // create those data to database
    doc = await measurementDB.create(mock);
    expect(doc).toMatchObject(mock);

  });


  it('can find all measurement', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    const mock = Array.from({length:3}).map(() => {
      var f = fakeMeasurement({timestamp: new Date()});
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findAll().submit()
      .then(doc => {
        expect(doc).toMatchObject(mock);
      })

  });


  it('can find all measurement with specific mac address', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({timestamp: new Date()});
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })
    
    // change mac address of some data
    const dummy_similar_mac = "AA:BB:CC:DD:EE:FF"
    mock[2].mac_address = dummy_similar_mac;
    mock[4].mac_address = dummy_similar_mac;

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findByMac(dummy_similar_mac).submit()
      .then(doc => {
        expect(doc).toMatchObject([mock[2], mock[4]]);
      })

  });


  it('can delete all measurement with specific mac address', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({timestamp: new Date()});
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })
    
    // change mac address of some data
    const dummy_similar_mac = "AA:BB:CC:DD:EE:FF"
    mock[2].mac_address = dummy_similar_mac;
    mock[4].mac_address = dummy_similar_mac;

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.deleteAllMac(dummy_similar_mac)
      .then(doc => {
        expect(doc).toMatchObject({
          deletedCount: 2,
          ok: 1,
        });
      })

  });


  it('can limit result length', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    const mock = Array.from({length:20}).map(() => {
      var f = fakeMeasurement({timestamp: new Date()});
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // create those data to database
    await measurementDB.create(mock)

    const limit_to = 5;

    return measurementDB.findAll().limit(limit_to).submit()
      .then(doc => {
        expect(doc.length).toBe(limit_to);
      })

  });


  it('can sort ascending result by timestamp', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    const mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findAll().sort(1).submit()
      .then(doc => {
        expect(
          doc[0].timestamp <= doc[4].timestamp
        ).toBe(true);
      })

  });


  it('can sort descending result by timestamp', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    const mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findAll().sort(-1).submit()
      .then(doc => {
        expect(
          doc[0].timestamp >= doc[4].timestamp
        ).toBe(true);
      })

  });


  it('can get result after certain date', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // mock sorter function
    const sorter = (a,b) => {
      return a.timestamp >= b.timestamp ? 1 : -1;
    }

    // sort the mock
    mock = mock.sort(sorter);

    // get date of mock number 2
    cmpDate = mock[2].timestamp;

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findAll().dateFrom(cmpDate).submit()
      .then(doc => {
        expect(doc).toMatchObject(mock.slice(2,5));
      });

  });


  it('can get result before certain date', async () => {

    const measurementDB = makeMeasurementDB({modelDB: measurementDBModel});

    // generate few random mock data
    var mock = Array.from({length:5}).map(() => {
      var f = fakeMeasurement({
        timestamp: new Date(parseInt(Math.random() * Date.now()))
      });
      f.mac_address = f.mac_address.toUpperCase();
      return f;
    })

    // mock sorter function
    const sorter = (a,b) => {
      return a.timestamp >= b.timestamp ? 1 : -1;
    }

    // sort the mock
    mock = mock.sort(sorter);

    // get date of mock number 2
    cmpDate = mock[2].timestamp;

    // create those data to database
    await measurementDB.create(mock)

    return measurementDB.findAll().dateTo(cmpDate).submit()
      .then(doc => {
        expect(doc).toMatchObject(mock.slice(0,3));
      });

  });


});