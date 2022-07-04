const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogRouter = require('./controller/blog')
const userRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const middleware = require('./utils/middleware')

logger.info(`connecting to`, config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
// app.use(middleware.getTokenFrom)

app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/test')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.uknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;