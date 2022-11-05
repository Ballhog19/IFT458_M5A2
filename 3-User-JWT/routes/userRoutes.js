const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.loginRequired, userController.getAllUsers)
  //.post(userController.createUser);

router
  .route('/:id')
  .get(userController.loginRequired, userController.getUser)
  .patch(userController.loginRequired, userController.updateUser)
  .delete(userController.loginRequired, userController.deleteUser);

module.exports = router;
