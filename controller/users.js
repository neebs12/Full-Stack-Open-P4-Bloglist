// apply ability to create/add new users here
// this will only be possible in POST '/api/users' to create new users
require('express-async-errors')
const userRouter = require('express').Router()
const User = require('../models/users')

// create route(s)
// for displaying all existing users
userRouter.get('/', (request, response) => {
  response.status(500).json({error: 'route not yet implemented'})
})


// for creating a new user
userRouter.post('/', (request, response) => {
  response.status(500).json({error: 'route not yet implemented'})
})

module.exports = userRouter