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

// then we export these in via commonJS syntax
module.exports = {
  initialBlogs
}