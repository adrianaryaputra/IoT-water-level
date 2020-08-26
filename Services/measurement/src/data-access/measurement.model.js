module.exports = ({database: DB}) => {


  const MeasurementSchema = new DB.Schema({
    mac_address: { 
      type: String,
      uppercase: true,
      required: true
    },
    timestamp: { 
      type: Date,
      required: true
    },
    measurement: {
      level: {
        type: Number,
        required: true
      },
      temperature: Number,
      humidity: Number,
    },
    lifetime: { 
      type: Number,
      required: true
    }
  });

  return DB.model('measurement', MeasurementSchema);

}