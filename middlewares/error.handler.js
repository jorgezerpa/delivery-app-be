const boom = require('@hapi/boom');

function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    error: err.message,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function handleRepeatedValuesOnDB(err, req, res, next){
  if(err.errno === 1062){
    const column = err.message.includes('email') ? 'email' : 'user_name';
    res.json({
      message: `There is another with the same ${column}`,
      error: err.message
    });
    return;
  }
  next(err);
}


module.exports = { logErrors, errorHandler, boomErrorHandler, handleRepeatedValuesOnDB }
