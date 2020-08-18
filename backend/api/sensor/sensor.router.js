const express = require('express');
const router = express.Router();
const SensorAPISchema = require('./sensor.api.schema');
const SensorDBModel = require('./sensor.db.model');
const SensorEngine = require('./sensor.engine');

router.get('/', (req, res) => {
  q = SensorDBModel.find();

  if(req.query.mac_address){
    mac_raw = req.query.mac_address;
    mac_filtered = mac_raw.toUpperCase().replace(/:/gi,'-')
    q.find({
      mac_address: mac_filtered
    });
  }

  q.sort({name : 1});

  q.then((sensor) => {
    res.json(sensor)
  })
  .catch((err) => res.status(500).send("cannot obtain data"))
});

router.post('/', (req, res) => {
  SensorAPISchema.validateAsync(req.body)
  .then((val) => {
    // check if similar sensor exist
    SensorDBModel.findOne({
      mac_address: val.mac_address
    })
    .then((isExist) => {
      if(isExist){
        // res.json(isExist)
        res.status(422).send(`${val.mac_address} exist in database. use PUT method to update the devices`);
      } else {
        SensorEngine.create(val)
        .then(() => res.json({"message" : "ok"}))
        .catch(err => res.json(err));
      }
    })
    .catch(err => res.json(err));
  })
  .catch((err) => {
    res.status(422).send("invalid data schema");
    console.log(err)
  });
});

router.put('/', (req, res) => {
  SensorAPISchema.validateAsync(req.body)
  .then((val) => {
    SensorEngine.update(val.mac_address, val)
    .then((result) => {
      if(result) res.json({"message" : "ok"});
      else res.status(422).send(`${val.mac_address} not exist in database. Use POST method to add the devices`);
    })
    .catch((err) => res.json(err));
  })
  .catch((err) => {
    res.status(422).send("invalid data schema");
    console.log(err)
  });
});

module.exports = router;