const crypto = require('crypto');
const User = require('./../models/userModel');
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createSend(newUser, 201, res);
};

const createSend = (user, statusCode, res) => {
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      user
    }
  });
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  user.correctPassword = async function (password, password2) {
    return await bcrypt.compare(password, password2);
  }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send  to client
  createSend(user, 201, res);
};
