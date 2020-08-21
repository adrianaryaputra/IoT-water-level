const express = require('express');
const router = express.Router();

const MeasurementAPISchema = require('./measurement.api.schema');
const MeasurementDBModel = require('./measurement.db.model');
const MeasurementEngine = require('./measurement.engine');
const SensorEngine = require('../sensor/sensor.engine');

router.get('/',(req, res) => {

  q = MeasurementDBModel.find();

  // query by mac address
  if(req.query.mac_address){
    mac_raw = req.query.mac_address;
    mac_filtered = mac_raw.toUpperCase().replace(/:/gi,'-')
    q.find({
      mac_address: mac_filtered
    });
  }

  // find by date from
  if(req.query.date_from){
    date_from = new Date(req.query.date_from);
    if(isNaN(date_from.getTime())) {
      res.status(422).send("invalid query value: date_from");
    }
    else {
      q.find({
        timestamp: {$gte: date_from}
      });
    }
  }

  // find by date to
  if(req.query.date_to){
    date_to = new Date(req.query.date_to);
    if(isNaN(date_to.getTime())) {
      res.status(422).send("invalid query value: date_to");
    }
    else {
      q.find({
        timestamp: {$lte: date_to}
      });
    }
  }

  // sorting
  q.sort({timestamp: -1})

  // query limit
  if(req.query.limit){
    limit = parseInt(req.query.limit) > 200 ? 200 : parseInt(req.query.limit)
    q.limit(limit);
  } else {
    q.limit(20);
  }

  // show result
  q.exec((err, val) => {
    if(err){
      console.log(err);
      res.json(err);
    } else {
      res.json(val);
    }
  });
  
});

router.get('/aggregate',(req, res) => {

  aggregation = [];

  if(req.query.date_from){
    date_from = new Date(req.query.date_from);
    if(isNaN(date_from.getTime())) {
      if(!res.headersSent) res.status(422).send("invalid query value: date_from");
    }
    else {
      aggregation.push({
        $match: {
          timestamp: {$gte: date_from}
        }
      });
    }
  }

  if(req.query.date_to){
    date_from = new Date(req.query.date_to);
    if(isNaN(date_from.getTime())) {
      if(!res.headersSent) res.status(422).send("invalid query value: date_to");
    }
    else {
      aggregation.push({
        $match: {
          timestamp: {$lte: date_to}
        }
      });
    }
  }

  aggregation.push({
    $sort: { timestamp: -1 }
  });

  aggregation.push({
    $limit: 1000
  });

  aggregation.push({
    $project: {
      mac_address: 1,
      measurement : {
        level: '$measurement.level',
        temperature: '$measurement.temperature',
        humidity: '$measurement.humidity',
        timestamp: '$timestamp',
      }
    }
  })

  aggregation.push({
    $group: {
      _id: "$mac_address",
      measurement: {
        $push: "$measurement",
      }
    }
  });

  aggregation.push({
    $lookup: {
      from: 'sensors',
      localField: '_id',
      foreignField: 'mac_address',
      as: 'result'
    }
  });

  aggregation.push({
    $project: {
      name: {
        $arrayElemAt: [
          "$result.name", 0
        ]
      },
      last_seen: {
        $arrayElemAt: [
          "$result.last_seen", 0
        ]
      },
      update_time: {
        $arrayElemAt: [
          "$result.update_time", 0
        ]
      },
      location: {
        $arrayElemAt: [
          "$result.location", 0
        ]
      },
      alarm: {
        $arrayElemAt: [
          "$result.alarm", 0
        ]
      },
      measurement: { 
        "$slice": [ "$measurement", parseInt(req.query.limit) || 10 ] 
      }
    }
  })

  q = MeasurementDBModel.aggregate(aggregation);

  q.exec((err, val) => {
    if(err){
      console.log(err);
      if(!res.headersSent) res.json(err);
    } else {
      if(!res.headersSent) res.json(val);
    }
  });
  
});

router.post('/',(req, res) => {
  MeasurementAPISchema.validateAsync(req.body)
  .then((val) => {
    MeasurementEngine.create(res, val)
    .then(() => {
      SensorEngine.getUpdate(val.mac_address)
      .then((updateValue) => {
        if(updateValue){
          // if sensor exist, update last_seen
          SensorEngine.update(val.mac_address, {
            last_seen: Date.now()
          })
          .then(() => {
            // get timeout on POST measurement
            res.json({ 
              message: "ok", 
              set: updateValue
            })
          })
          .catch((err) => console.log(err));
        } 
        else {
          // if not exist, create a new sensor instance
          SensorEngine.create({
            mac_address: val.mac_address,
            update_time: val.lifetime,
            last_seen: Date.now()
          })
          .then(() => {
            res.json({
              message: "ok"
            });
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
    })
    .catch((err) => {
      console.log(err)
    });
  })
  .catch((err) => {
    res.status(422).send("invalid data schema");
    console.log(err)
  });
});

module.exports = router;
