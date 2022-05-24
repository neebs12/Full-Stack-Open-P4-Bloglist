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

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  let myBlog = new Blog(newBlog)
  let result = await myBlog.save()
  response.status(201).json(result)
})

// for DELETE
blogRouter.delete('/:id', async (request, response) => {
  let id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

// for PUT
blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  const blog = {...body}

  let newBlog = await Blog.findByIdAndUpdate(id, body, {new: true})

  response.status(200).json(newBlog)
})

module.exports = blogRouter;