const express = require('express');
const bodyParser = require('body-parser');
const Config = require('./config');

const httpCallback = require('../../_shared_/httpCallback/express.callback');

const {
  getMeasurement,
  postMeasurement,
  deleteMeasurement,
} = require('./controller')


const app = express()
app.use(bodyParser.json());

app.get(Config.HTTP_ADDRESS, httpCallback(getMeasurement));
app.post(Config.HTTP_ADDRESS, httpCallback(postMeasurement));
app.delete(Config.HTTP_ADDRESS, httpCallback(deleteMeasurement));

server = app.listen(process.env.API_PORT);

module.exports = {
  app,
  server,
};