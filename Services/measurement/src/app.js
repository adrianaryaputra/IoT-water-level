const express = require('express');
const bodyParser = require('body-parser');
const Config = require('./config');

const httpCallback = require('../../_shared_/httpCallback/express.callback');
const httpRouter = require('./routes');

const routes = httpRouter({
  httpRouter: express.Router(),
  httpCallback,
  Config, 
});

const app = express()
app.use(bodyParser.json());
app.use(routes);

server = app.listen(process.env.API_PORT);

module.exports = {
  app,
  server,
};