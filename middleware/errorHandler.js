const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad object id & id not found
  if (err.name === 'CastError' || err.name === 'NotFound') {
    error = new ErrorResponse(
      `Bootcamp not found with id of ${err.value}`,
      404
    );
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((err) => err.message);
    error = new ErrorResponse(messages, 400);
  }

  // Mongoose duplicated key
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicated key error collection', 400);
  }

  // Return response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
