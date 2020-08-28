VERSION = 'v1';

module.exports = Object.freeze({

  HTTP_ADDRESS: `/api/${VERSION}/measurement`,
  HTTP_PORT: 
    process.env.MEASUREMENT_HTTP_PORT ||
    '3000',

  DB_ADDRESS:
    process.env.MEASUREMENT_DB_ADDRESS ||
    'mongodb://localhost:27017/waterlevel-measurement-test',

  QUERY_LIMIT: 1000,
  QUERY_DEFAULT: 20,

  UPDATE_MIN: 1,
  UPDATE_MAX: 3600,
  TEMP_MIN: 10,
  TEMP_MAX: 80,
  LEVEL_MIN: 0,
  LEVEL_MAX: 10,
  HUMIDITY_MIN: 0,
  HUMIDITY_MAX:100,

});