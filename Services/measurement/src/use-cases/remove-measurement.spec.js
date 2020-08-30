const {measurementDB, DB} = require('../data-access-mongoose');

const fakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

const makeDeleteMeasurement = require('./remove-measurement');

const deleteMeasurement = makeDeleteMeasurement({measurementDB});


describe('simulate delete measurement from databases', () => {





  beforeEach(async () => {
    await measurementDB().deleteObj({});
  });


  afterAll(async () => {
    await measurementDB().deleteObj({});
    DB.connection.close();
  });


  it('should be able to delete specific mac address', async () => {

    var mock = fakeMeasurement({timestamp: new Date()});
    await measurementDB().create([
      mock, mock, 
      {
        ...mock, 
        mac_address:"AA-BB-CC-DD-EE-FF"
      }
    ]);

    deleteMeasurement(mock.mac_address)
      .then(result => {
        expect(result.ok).toBe(1);
        expect(result.deletedCount).toBe(2);
      })

  });





})