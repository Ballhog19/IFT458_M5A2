const express = require('express');
const morgan = require('morgan');
const jsonwebtoken = require('jsonwebtoken');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
})

// 3) ROUTES
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/users', userRouter);

module.exports = app;
