const Joi = require('joi')

module.exports = Joi.object({

  mac_address: Joi
    .string()
    .pattern(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    )
    .replace(/:/g, '-'),

  date_from: Joi.date(),
  date_to: Joi.date(),
  limit: Joi
    .number()
    .max(1000)
    .min(1)
    .default(10),

});

