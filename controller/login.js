require('express-async-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

/*
- `controller/login.js` use used for creating a **valid token** (POST) given credentials, valid username and password. Token is sent back to the client.
- Here, we are given a password and a username via POST
- We then get the user from database given user
	- if user does not exists, respond with 401
	- if the user exists, compare passwords with `bcrypt.compare(password, user.hash)`
	- if the compared passwords are incorrect, respond with 401
- Then create a `userForToken` with `username` and `id`
- Then sign the token with `jwt.sign`, against the `userForToken` given `.env.SECRET` 
- Respond to the client with 200, token, username and name
- Plus export the router
*/

loginRouter.post('/', async (request, response) => {
  const username = request.body.username
  const password = request.body.password

  // finds first matching document, think array.prt.find
  // 401 for unauthorized
  const user = await User.findOne({username}) 
  if (!user) return response.status(401).json({error: 'username not found'})

  const compare = await bcrypt.compare(password, user.passwordHash)
  if (!compare) return response.status(401).json({error: 'invalid password'})

  // here, username and password are legitimate, create a token
  const payload = {
    username, 
    id: user.id,
  }

  // sign with payload
  let token = jwt.sign(payload, process.env.SECRET)

  response.status(200)
    .json({token, username, name: user.name})
})

module.exports = loginRouter