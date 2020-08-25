const validator = require('../validator');
const {listMeasurement} = require('../use-cases');

module.exports = function({ listMeasurement }){
  return async function getMeasurement(httpRequest){

    const headers = {
      'Content-Type': 'application/json',
    }

    const nonvalidatedQuery = {
      mac_address: httpRequest.query.mac_address,
      date_from: new Date(httpRequest.query.date_from),
      date_to: new Date(httpRequest.query.date_to),
      limit: parseInt(httpRequest.query.limit),
    }
    
    const validatedQuery = validator.validateGetQuery(nonvalidatedQuery);

    try{

      const measurementBody = await listMeasurement(validatedQuery);
      return {
        headers: headers,
        statusCode: 200,
        body: measurementBody,
      }

    } catch(e) {
      
      return {
        headers: headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      }
      
    }

  }
}