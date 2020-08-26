const mongoose = require('mongoose');

mongoose.connect(process.env.MEASUREMENT_DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
},(err) => {
    if(err) console.log(err);
});

module.exports = mongoose;