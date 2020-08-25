console.log(require('dotenv').config({path: '../.env'}))

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const httpCallback = require('../../_shared_/httpCallback/express.callback');

const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', httpCallback(null));

app.listen(process.env.API_PORT, () => {
  console.log(`listening on port ${process.env.API_PORT}`);
});