var faker = require('faker');
faker.locale = "en_US";

module.exports = (override) => {

  const measurement = {
    mac_address: faker.internet.mac(),
    lifetime: 100,
    measurement: {
      level: 3.12,
      temperature: 28.56,
      humidity: 54.23,
    },
  }

  return {
    ...measurement,
    ...override,
  }

}