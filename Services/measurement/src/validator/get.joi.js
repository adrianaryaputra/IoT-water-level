const Joi = require('joi');
const Config = require('../config');

const MacSchema = Joi
  .string()
  .pattern(
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  )
  .replace(/:/g, '-')
  .uppercase();

module.exports = Joi.object({

  mac_address: Joi.alternatives().try(
    Joi.array().items(MacSchema),
    MacSchema,
  ),

  date_from: Joi.date(),
  date_to: Joi.date(),
  limit: Joi
    .number()
    .max(Config.QUERY_LIMIT)
    .min(1)
    .default(Config.QUERY_DEFAULT),

});

