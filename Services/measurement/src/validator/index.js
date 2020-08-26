const utils = require('../../../_shared_/utils')
const measurementApiSchema = require('./measurement.joi');
const httpGetQuerySchema = require('./get.joi');


module.exports = Object.freeze({
  validateApi: (obj) => { 
    return validateJoi({
      obj, 
      schema: measurementApiSchema
    }); 
  },
  validateGetQuery: (obj) => { 
    return validateJoi({
      obj, 
      schema: httpGetQuerySchema
    }); 
  },
});


function validateJoi({obj, schema}){
  const {value, error} = schema.validate(obj);
  if(error){
    throw error;
  }
  else{
    return utils.obj.removeEmptyKey(value);
  }
}