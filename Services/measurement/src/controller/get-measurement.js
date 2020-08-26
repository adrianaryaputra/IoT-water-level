module.exports = function({ listMeasurement, validator }){
  return async function getMeasurement(httpRequest){

    const headers = {
      'Content-Type': 'application/json',
    }

    const nonvalidatedQuery = {
      mac_address: httpRequest.query.mac_address,
      date_from: httpRequest.query.date_from,
      date_to: httpRequest.query.date_to,
      limit: httpRequest.query.limit,
    }
    
    try{

      const validatedQuery = validator.validateGetQuery(nonvalidatedQuery);
      const measurementBody = await listMeasurement(validatedQuery);
      
      return {
        headers: headers,
        statusCode: 200,
        body: {
          success: true,
          payload: measurementBody,
        },
      }

    } catch(e) {
      
      return {
        headers: headers,
        statusCode: 400,
        body: {
          success: false,
          error: e.message,
        },
      }
      
    }

  }
}