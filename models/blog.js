const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number, 
  user: { // single user (author) for single blog post
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// think of this as a middleware(?) that is applied on the returned object
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog