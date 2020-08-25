var faker = require('faker');
const { min } = require('../../src/validator/get.joi');
faker.locale = "en_US";

module.exports = (override) => {

  const measurement = {
    mac_address: faker.internet.mac(),
    date_from: faker.date.past(),
    date_to: faker.date.recent(),
    limit: faker.random.number({min:1, max:100, precision:1})
  }

  return {
    ...measurement,
    ...override,
  }

}