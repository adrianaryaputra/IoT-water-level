const mongoose = require('mongoose');
const Config = require('../config');

mongoose.connect(Config.DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
},(err) => {
    if(err) console.log(err);
});

module.exports = mongoose;