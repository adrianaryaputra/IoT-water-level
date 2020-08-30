module.exports = ({measurementDB}) => {

  return async(body) => {

    body.timestamp = new Date();

    const measurement = measurementDB();
    result = await measurement.create(body);
    return result;

  }

}