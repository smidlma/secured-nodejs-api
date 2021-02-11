const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  let token = req.headers['x-json-web-token'];
  if (!token) {
    res.status(403).send('No token was provided');
  } else {
    jwt.verify(token, config.secretKey, (error, decoded) => {
      if (error) {
        res.status(500).send('There was an error');
      } else {
        req.token = token;
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = verifyToken;
