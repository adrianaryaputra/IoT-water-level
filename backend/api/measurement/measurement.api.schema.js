const Joi = require('joi')

module.exports = Joi.object({
  mac_address: Joi.string()
          .required()
          .pattern(
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
          )
          .replace(/:/g, '-'),

  lifetime: Joi.number()
               .required()
               .min(parseInt(process.env.UPDATE_MIN))
               .max(parseInt(process.env.UPDATE_MAX)),

  measurement: {

    level: Joi.number()
              .required()
              .min(parseInt(process.env.LEVEL_MIN))
              .max(parseInt(process.env.LEVEL_MAX)),

    temperature: Joi.number()
                    .min(parseInt(process.env.TEMP_MIN))
                    .max(parseInt(process.env.TEMP_MAX)),

    humidity: Joi.number()
                 .min(parseInt(process.env.HUMIDITY_MIN))
                 .max(parseInt(process.env.HUMIDITY_MAX)),

  }
  
})