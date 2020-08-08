const MeasurementDBModel = require('./measurement.db.model');

module.exports = {
  create: async (httpResponse, value) => {

    var measurement = new MeasurementDBModel({
      mac_address: value.mac_address,
      timestamp: Date.now(),
      lifetime: value.lifetime,
      measurement: value.measurement
    });
    
    return new Promise((resolve, reject) => {
      measurement.save()
      .then(() => {
        resolve()
      })
      .catch(err => reject(err));
    });
  }
}