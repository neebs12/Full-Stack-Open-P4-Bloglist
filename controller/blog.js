// contains all the relevant routes
const blogRouter = require('express').Router();
const Blog = require('../models/blog')
const logger = require('../utils/logger')

// for GET ALL
blogRouter.get('/', (request, response) => {
  Blog.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      // hangon, this has to be on the next(error)!
      logger.error(error)
    })
})

// for POST
blogRouter.post('/', (request, response) => {
  let newBlog = new Blog(request.body)

  newBlog.save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {
      logger.error(error)
    })
})


module.exports = blogRouter;