var faker = require('faker');
faker.locale = "en_US";

module.exports = (override) => {

  const measurement = {
    mac_address: faker.internet.mac().replace(/:/g,'-'),
    lifetime: faker.random.number({min:1, max:100, precision:1}),
    measurement: {
      level: faker.random.number({min:1, max:4, precision:0.01}),
      temperature: faker.random.number({min:28, max:30, precision:0.01}),
      humidity: faker.random.number({min:49, max:51, precision:0.01}),
    },
  }

  return {
    ...measurement,
    ...override,
  }

}