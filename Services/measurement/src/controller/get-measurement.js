const validator = require('../validator');

module.exports = function({ listMeasurement }){
  return async function getMeasurement(httpRequest){

    const headers = {
      'Content-Type': 'application/json',
    }

    const query = validator.validateGetQuery(httpRequest.query);

    try{

      const measurementBody = await listMeasurement(query);
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