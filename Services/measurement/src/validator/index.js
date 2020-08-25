const measurementApiSchema = require('./measurement.joi');
const httpGetQuerySchema = require('./get.joi');


module.exports = Object.freeze({
  validateApi: (obj) => { validateJoi({obj, schema: measurementApiSchema}); },
  validateGetQuery: (obj) => { validateJoi({obj, schema: httpGetQuerySchema}); },
});


function validateJoi({obj, schema}){
  validation = schema.validate(obj);
  if(!validation.error){
    throw new Error('invalid data model');
  } else {
    return validation.value;
  }
}