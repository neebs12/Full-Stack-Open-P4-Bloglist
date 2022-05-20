// contains all the relevant routes
require('express-async-errors')
const blogRouter = require('express').Router();
const Blog = require('../models/blog')

// for GET ALL
blogRouter.get('/', async (request, response) => {
  let result = await Blog.find({})
  response.json(result)
})

blogRouter.get('/error', async (request, response) => {
  await Promise.reject(new Error('display this error'))
})


// for POST
blogRouter.post('/', async (request, response) => {
  // default to likes zero
  let newBlog = {
    ...request.body,
    likes: request.body.likes || 0
  }

  let myBlog = new Blog(newBlog)
  let result = await myBlog.save()
  response.status(201).json(result)
})


module.exports = blogRouter;