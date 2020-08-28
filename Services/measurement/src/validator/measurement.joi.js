const Joi = require('joi');
const Config = require('../config');

const measurementSchema = Joi.object().keys({
  level: Joi
    .number()
    .required()
    .min(parseInt(Config.LEVEL_MIN))
    .max(parseInt(Config.LEVEL_MAX)),

  temperature: Joi
    .number()
    .min(parseInt(Config.TEMP_MIN))
    .max(parseInt(Config.TEMP_MAX)),

  humidity: Joi
    .number()
    .min(parseInt(Config.HUMIDITY_MIN))
    .max(parseInt(Config.HUMIDITY_MAX)),
})

module.exports = Joi.object().keys({
  mac_address: Joi
    .string()
    .required()
    .pattern(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    )
    .replace(/:/g, '-')
    .uppercase(),

  lifetime: Joi
    .number()
    .required()
    .min(parseInt(Config.UPDATE_MIN))
    .max(parseInt(Config.UPDATE_MAX)),

  measurement: measurementSchema.required(),
  
});