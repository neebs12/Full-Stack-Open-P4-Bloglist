const Blog = require('../models/blog')

// here we create hardcoded blog entries
// structure {title, author, url, likes:Number}
let initialBlogs = [
  {
    "title": "initial blog!",
    "author": "hp",
    "url": "https://blog-world.com",
    "likes": 4
  },
  {
    "title": "life at hogwarts",
    "author": "harry potter",
    "url": "https://wizard-world.com",
    "likes": 1
  },
  {
    "title": "imperium is the best",
    "author": "the emperor",
    "url": "https://40k.io",
    "likes": 10
  },    
] 

const blogsInDb = async () => {
  // .toJSON is appropriate as this executes the 
  // -- special 'toJSON' functionality in models/blog.js
  let blogObjects = await Blog.find({})
  let proccessed = blogObjects.map(blog => blog.toJSON())
  return proccessed
}

/*not exported, yet*/
const getNonExistentId = async () => {
  // function adds extracts a non-existent id by
  // -- saving and deleting an item in the database 
  // -- but extracting the datadase-created id upon 
  // -- creation/deletion
  // code below is not working, will fail tests
  // -- likely due to asyncronous nature of operations
  // return '123'
  let blog = new Blog ({
    title: "deleteme!",
    author: "deleteme!",
    url: "https://deleteme.com",
    likes: 2
  })
  await blog.save() // FUDGE BRO YOU FORGOT THE AWAIT HERE
  await blog.remove()
  let id = blog._id.toString()
  return id
}

// then we export these in via commonJS syntax
module.exports = {
  initialBlogs, blogsInDb, getNonExistentId
}