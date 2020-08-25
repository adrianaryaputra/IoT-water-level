const validator = require('.');
const makeFakeMeasurement = require('../../__test__/fixture/fakeMeasurement');
const { ValidationError } = require('joi');

describe('validate measurement schema', () => {

  it('have no problem', () => {
    const measurement = makeFakeMeasurement();
    const check = validator.validateApi(measurement);
    measurement.mac_address = measurement.mac_address.replace(/:/g,'-').toUpperCase();
    expect(check).toMatchObject(measurement);
  });


  it('require mac address', () => {
    const measurement = makeFakeMeasurement({mac_address: undefined});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('deny invalid mac address', () => {
    const measurement = makeFakeMeasurement({mac_address: 'invalidMac'});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('require lifetime', () => {
    const measurement = makeFakeMeasurement({lifetime: undefined});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('deny NaN lifetime', () => {
    const measurement = makeFakeMeasurement({lifetime: NaN});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('deny negative lifetime', () => {
    const measurement = makeFakeMeasurement({lifetime: -1});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('deny too huge lifetime', () => {
    const measurement = makeFakeMeasurement({lifetime: 1000000});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('required measurement', () => {
    const measurement = makeFakeMeasurement({measurement: undefined});
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('required measurement level', () => {
    const measurement = makeFakeMeasurement({
      measurement: {
        level: undefined
      }
    });
    expect(() => {
      validator.validateApi(measurement)
    }).toThrow(ValidationError);
  });


  it('allow empty temperature', () => {
    const measurement = makeFakeMeasurement();
    measurement.measurement.temperature = undefined;
    const check = validator.validateApi(measurement);
    measurement.mac_address = measurement.mac_address.replace(/:/g,'-').toUpperCase();
    expect(check).toMatchObject(measurement);
  });


  it('allow empty humidity', () => {
    const measurement = makeFakeMeasurement();
    measurement.measurement.humidity = undefined;
    const check = validator.validateApi(measurement);
    measurement.mac_address = measurement.mac_address.replace(/:/g,'-').toUpperCase();
    expect(check).toMatchObject(measurement);
  });
  
});