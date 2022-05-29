// contains all the relevant routes
require('express-async-errors')
const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router();
const Blog = require('../models/blog')
const User = require('../models/users')

// for GET ALL
blogRouter.get('/', async (request, response) => {
  let result = await Blog
    .find({})
    .populate('user', {username: 1, name: 1, id: 1})
  response.json(result)
})

blogRouter.get('/error', async (request, response) => {
  let e = Error('display this error')
  e.name = 'CustomError'
  throw e // <--goes straight to middleware
})

// for POST
blogRouter.post('/', async (request, response) => {
  let user = request.user
  if (!user) {
    return response.status(400).json({error: 'token missing or invalid'})
  }
  let directId = user._id.toString()

  // OK, change to title, author, and url
  let newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    user: directId, // note ObjectId("") is needed, NOT the .toString() variation
    likes: request.body.likes || 0
  }

  // no title, url, or user(id) - compulsory
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  // with the new id, need to determine if this is a valid user
  let referencedAuthor = await User.findById(newBlog.user)
  if (!referencedAuthor) {
    return Promise.reject('author not found')
  }

  // existing author/user is found, can update blogs collection
  let myBlog = new Blog(newBlog)
  let result = await myBlog.save()
  
  // ...and update the author with the blog's id (from the result)
  let blogs = referencedAuthor.blogs
  blogs.push(result.id)
  await referencedAuthor.save()

  response.status(201).json(result)
})

// for DELETE
blogRouter.delete('/:id', async (request, response) => {
  let user = request.user
  if (!user) {
    return response.status(400).json({error: 'token missing or invalid'})
  }
  let userIdWantingToDeleteBlog = user.id
  
  // get the blog that wants to be deleted, to get the user id/author of the blog
  let id = request.params.id
  let blog = await Blog.findById(id)
  let userIdOwningTheBlog = blog.user.toString()
  if (userIdWantingToDeleteBlog !== userIdOwningTheBlog) {
    return response.status(401)
      .json({error: 'do not have the authority to delete the blog'})
  }
  // await Blog.findByIdAndDelete(id)

  // else, here correct user that wants to delete blog
  await blog.remove()
  response.status(204).end()
})

// for PUT
blogRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  // find by id first - then 404 if not found
  const blog = await Blog.findById(id)
  if (!blog) return response.status(404).end() // YES

  const body = request.body
  let newBlog = await Blog.findByIdAndUpdate(id, body, {new: true})
  response.status(200).json(newBlog)
})

module.exports = blogRouter;