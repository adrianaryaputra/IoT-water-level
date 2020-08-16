const SensorDBModel = require('./sensor.db.model');

module.exports = {
  create: (value) => {
    value.mac_address = value.mac_address.toUpperCase().replace(/:/gi,'-')
    var sensor = new SensorDBModel(value);
    return new Promise((resolve, reject) => {
      sensor.save()
      .then(() => {
        resolve()
      })
      .catch(err => reject(err));
    });
  },

  getUpdate: (mac_address) => {
    return new Promise((resolve, reject) => {
      SensorDBModel.findOne({
        mac_address: mac_address.toUpperCase().replace(/:/gi,'-')
      })
      .then(result => {
        if(result) resolve(result);
        else resolve(result)
      })
      .catch(err => reject(err));
    });
  },

  update: (mac_address, update_value) => {
    return SensorDBModel.findOneAndUpdate({
      mac_address: mac_address.toUpperCase().replace(/:/gi,'-')
    }, update_value)
  }
}