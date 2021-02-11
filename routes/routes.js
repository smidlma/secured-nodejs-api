const verifyToken = require('../utils/verifyToken');
const config = require('../config');
const authController = require('../controller/authController');
const registerUser = authController.registerUser;
const getRegistredUser = authController.getRegistredUser;
const loginUser = authController.loginUser;

const routes = (app) => {
  app
    .route('/auth/register')
    .post(registerUser)
    .get(verifyToken, getRegistredUser);
  app.route('/auth/login').post(loginUser);
  app.route('/content').get(verifyToken, (req, res) => {
    res.status(200).send('Content page only for log in users');
  });
};

module.exports = routes;
