const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
 const message = `Invalid ${err.path}: ${err.value}.`;
 return new AppError(message, 400);
};

const handleJWTExpireError = () =>
 new AppError('This token has expired!, Please login again!, 401');

const handleJWTError = () =>
 new AppError('Invalid token, please log in again!', 401);

const handleDuplicateFieldsDB = (err) => {
 const value = err.errmsg.match(/(["'])(\\?.)*?\1/g)[0];
 console.log(value);
 const message = `Duplicate value: ${value} . please use another value`;
 return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
 const errors = Object.values(err.errors).map((el) => el.message);

 const message = `Invalid input data. ${errors.join('. ')}`;
};

const sendErrorDev = (err, res) => {
 res.status(err.statusCode).json({
  status: err.status,
  error: err,
  message: err.message,
  stack: err.stack,
 });
};

const sendErrorProd = (err, res) => {
 //Operational error: trusted error: Send message to the client
 if (err.isOperational) {
  res.status(err.statusCode).json({
   status: err.status,
   message: err.message,
  });
  //Programming error or unknown error: Dont leak to the client!
 } else {
  //1. Log the error
  console.error('ERROR🤣', err);
  //2. Generic error!
  res.status(500).json({
   status: 'error',
   message: 'Something went very wrong!',
  });
 }
};

module.exports = (err, req, res, next) => {
 //   console.log(err.stack);

 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'Error';

 if (process.env.NODE_ENV === 'development') {
  sendErrorDev(err, res);
 } else if (process.env.NODE_ENV === 'production') {
  let error = { ...err };
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpireError();
  sendErrorProd(error, res);
 }
};


