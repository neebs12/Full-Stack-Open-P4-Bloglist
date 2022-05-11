const logger = require('./logger')

// we want a request body logger
const requestLogger = () => {}
// we want an unknown endpoint logger
const uknownEndpoint = () => {}
// we want a user-defined error handler
const errorHandler = () => {}

module.exports = {
  requestLogger,
  uknownEndpoint,
  errorHandler,
}