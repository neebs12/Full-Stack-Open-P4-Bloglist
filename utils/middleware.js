const logger = require('./logger')

// we want a request body logger
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next();
}
// we want an unknown endpoint logger
const uknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
// we want a user-defined error handler
const errorHandler = (error, request, response, next) => {
  logger.info('Hello there!')
  logger.error(error.message) // message meant for the dev

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'}) // message meant for the user agent
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

module.exports = {
  requestLogger,
  uknownEndpoint,
  errorHandler,
}