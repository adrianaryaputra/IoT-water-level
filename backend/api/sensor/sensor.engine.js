const SensorDBModel = require('./sensor.db.model');

module.exports = {
  create: (value) => {
    var sensor = new SensorDBModel(value);
    return new Promise((resolve, reject) => {
      sensor.save()
      .then(() => {
        resolve()
      })
      .catch(err => reject(err));
    });
  },

  getUpdateTime: (mac_address) => {
    return new Promise((resolve, reject) => {
      SensorDBModel.findOne({
        mac_address: mac_address
      })
      .then(result => {
        if(result) resolve(result.update_time);
        else resolve(result)
      })
      .catch(err => reject(err));
    });
  },

  update: (mac_address, update_value) => {
    return SensorDBModel.findOneAndUpdate({
      mac_address: mac_address
    }, update_value)
  }
}