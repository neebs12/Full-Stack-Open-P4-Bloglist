// contains all the relevant routes
const blogRouter = require('express').Router();
const Blog = require('../models/blog')

// for GET ALL
blogRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

blogRouter.get('/error', (request, response, next) => {
  next(new Error('display this error'))
})


// for POST
blogRouter.post('/', (request, response, next) => {
  // default to zero
  let newBlog = {
    ...request.body,
    likes: request.body.likes || 0
  }
  
  let myBlog = new Blog(newBlog)
  myBlog.save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})


module.exports = blogRouter;