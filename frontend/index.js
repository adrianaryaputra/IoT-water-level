'use strict';
require('dotenv').config()

const express = require('express');
const app = express();

app.use(express.static('public'))
app.listen(process.env.STATIC_PORT, () => {
  console.log(`listening on port ${process.env.STATIC_PORT}`);
});