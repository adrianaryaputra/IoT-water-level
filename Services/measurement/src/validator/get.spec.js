const validator = require('.');
const makeFakeGetQuery = require('../../__test__/fixture/fakeGetQuery');
const { ValidationError } = require('joi');
const fakeGetQuery = require('../../__test__/fixture/fakeGetQuery');

describe('validate measurement schema', () => {


  it('have no problem', () => {
    const fakeGetQuery = makeFakeGetQuery();
    const check = validator.validateGetQuery(fakeGetQuery);
    fakeGetQuery.mac_address = fakeGetQuery
      .mac_address
      .replace(/:/g,'-')
      .toUpperCase();
    expect(check).toMatchObject(fakeGetQuery);
  });


  it('deny invalid mac address', () => {
    const fakeGetQuery = makeFakeGetQuery({mac_address: 'invalid'});
    expect(() => {
      validator.validateGetQuery(fakeGetQuery);
    }).toThrow(ValidationError)
  });

  
  it('deny invalid date_from', () => {
    const fakeGetQuery = makeFakeGetQuery({date_from: 'invalid'});
    expect(() => {
      validator.validateGetQuery(fakeGetQuery);
    }).toThrow(ValidationError)
  });


  it('deny invalid date_to', () => {
    const fakeGetQuery = makeFakeGetQuery({date_to: 'invalid'});
    expect(() => {
      validator.validateGetQuery(fakeGetQuery);
    }).toThrow(ValidationError)
  });


  it('deny invalid limit', () => {
    const fakeGetQuery = makeFakeGetQuery({limit: 'invalid'});
    expect(() => {
      validator.validateGetQuery(fakeGetQuery);
    }).toThrow(ValidationError)
  });


});