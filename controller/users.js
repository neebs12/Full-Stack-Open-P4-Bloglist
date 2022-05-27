// apply ability to create/add new users here
// this will only be possible in POST '/api/users' to create new users
require('express-async-errors')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/users')

const raiseError = (errorName, errorMessage) => {
  let e = Error(errorMessage)
  e.name = errorName
  throw e
}

// create route(s)
// for displaying all existing users
userRouter.get('/', async (request, response) => {
  let users = await User.find({})
  response.status(200).json(users)
})


// for creating a new user
userRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  // validate username uniqueness here
  // get all usernames, see if name already exists in all names, good
  let users = await User.find({}, {username: 1})
  let usernames = users.map(user => user.username)
  if (usernames.includes(username)) {
    raiseError('ValidationError', 'username already exists')
  }

  // validate password length AND requirement here

  // to raise an error, await Promise.reject(error)

  const saltRounds = 10 // trust FSO
  const passwordHash = await bcrypt.hash(password, saltRounds) // gens hash

  // based on username + name + HASH, create and save a new user
  const user = new User({
    username, name, passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = userRouter