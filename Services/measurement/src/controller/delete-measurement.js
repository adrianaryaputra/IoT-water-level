module.exports = ({removeMeasurement, validator}) => {

  return async (httpRequest) => {

    const headers = {
      'Content-Type': 'application/json',
    }

    const nonvalidatedQuery = {
      mac_address: httpRequest.query.mac_address,
    }

    try{

      const validatedQuery = validator.validateGetQuery(nonvalidatedQuery);
      const result = await removeMeasurement(validatedQuery.mac_address);
      
      return {
        headers: headers,
        statusCode: 200,
        body: {
          success: true,
          payload: result,
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