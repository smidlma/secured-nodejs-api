const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./route/routes');

mongoose.connect('mongodb://localhost:27017/mongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

routes(app);

app.listen(config.port, () => {
  console.log(`Running at port: ${config.port}`);
});
