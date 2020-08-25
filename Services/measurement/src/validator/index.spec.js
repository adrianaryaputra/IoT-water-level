const validator = require('./');
const makeFakeMeasurement = require('../../__test__/fixture/fakeMeasurement');

describe('validate measurement schema', () => {

  it('should have no problem', () => {
    const measurement = makeFakeMeasurement();
    const check = validator.validateApi(measurement);
    expect(check).toMatchObject(measurement);
  });

});