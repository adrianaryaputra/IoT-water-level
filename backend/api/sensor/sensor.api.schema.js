const Joi = require('joi')

module.exports = Joi.object({
  mac_address: Joi.string()
          .required()
          .pattern(
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
          )
          .replace(/:/g, '-'),

  name: Joi.string()
           .default(process.env.DEFAULT_DEVICE_NAME),
  
  update_time: Joi.number()
                  .required()
                  .min(parseInt(process.env.UPDATE_MIN)) //second
                  .max(parseInt(process.env.UPDATE_MAX)), //second

  location: {
    lat: Joi.number().default(0),
    long: Joi.number().default(0)
  },
})