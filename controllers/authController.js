const userSchema = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('User', userSchema);

const registerUser = (req, res) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      let hashedPassword = bcrypt.hashSync(req.body.password, 8);
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      newUser.save((error, User) => {
        let token = jwt.sign({ id: User._id }, config.secretKey, {
          expiresIn: 86400,
        });
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).send({ auth: true, token: token });
        }
      });
    } else {
      res.status(500).send('Already exists');
    }
  });
};

const getRegistredUser = (req, res) => {
  let token = req.token;
  let decoded = req.decoded;
  if (!token) {
    res.status(401).send({ auth: false, message: 'Token is not provoded' });
  } else {
    User.findById(decoded.id, { password: 0 }, (error, User) => {
      if (error) {
        res.status(500).send('There was an error finding that user');
      } else if (!User) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(User);
      }
    });
  }
};

const loginUser = (req, res) => {
  User.findOne({ email: req.body.email }, (error, User) => {
    if (error) {
      res.status(500).send('There was an error');
    } else if (!User) {
      res.status(404).send('User does not exist');
    } else {
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        User.password
      );
      if (!passwordIsValid) {
        res.status(401).send({ auth: false, token: null });
      } else {
        let token = jwt.sign({ id: User._id }, config.secretKey, {
          expiresIn: 86400,
        });
        res.status(200).send({ auth: true, token: token });
      }
    }
  });
};

module.exports = {
  registerUser,
  getRegistredUser,
  loginUser,
};
