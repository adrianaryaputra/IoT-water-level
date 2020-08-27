module.exports = ({measurementDB}) => {

  return async(body) => {

    const measurement = measurementDB();
    result = await measurement.create(body);
    return result;

  }

}