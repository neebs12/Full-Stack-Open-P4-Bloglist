const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/users')

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
  // logger.info('Hello there!')
  logger.error(error.message) // message meant for the dev

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'}) // message meant for the user agent
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({error: error.message})
  } else if (error.name === 'CustomError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

const getTokenFrom = (request, response, next) => {
  let authHeaderVal = request.get('authorization')
  // see if val even exists
  if (!authHeaderVal) return next() 

  let [_, token] = authHeaderVal.split(' ')
  request.token = token // mutate for future use
  next()
}

const userExtractor = async (request, response, next) => {
  // extracts the user to request.user
  let authHeaderVal = request.get('authorization')
  // see if val even exists
  if (!authHeaderVal) return next() 
  let [_, token] = authHeaderVal.split(' ')

  // decode the token given .env.SECRET
  let decodedToken = jwt.verify(token, process.env.SECRET)
  // here, a token exists, but can be invalid when decoded
  // -- thus, prematurely return with request obj unmutated
  if (!decodedToken.id) return next()

  // else, get the relevant ids
  let id = decodedToken.id
  let user = await User.findById(id)
  request.user = user
  next()
}

module.exports = {
  requestLogger,
  uknownEndpoint,
  errorHandler,
  // getTokenFrom,
  userExtractor,
}