const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blog_api_test_helper')

const api = supertest(app)

// this will run prior to all tests
beforeEach(async () => {
  // delete all
  await Blog.deleteMany({})
  let savePromiseAry = helper.initialBlogs.map(blog => {
    let blogObject = new Blog(blog)
    // .save() has a return value that is a promise itself
    return blogObject.save() 
  })
  // .allSettled ensures multiple requests are wrapped in a single
  // -- promise, and does not callback does not finish until this is
  // -- completed
  await Promise.allSettled(savePromiseAry)
})

describe('when there is initially some blogs saved:', () => {
  test('blogs are returned as json', async () => {
    // code does not actually check for content being serialized to 
    // -- json, the response header is checked instead
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/) // <-- check for json
  })

  test('correct number of blogs returned when requested', async () => {
    // notice lack of `.expect()` here due to 'get' being tested already!
    // let response = await api.get('/api/blogs')
    let blogs = await helper.blogsInDb()
    expect(blogs.length).toBe(helper.initialBlogs.length)
  })

  test('`id` is present on returned object', async () => {
    // this is testing the `toJSON` method in models/blog
    let blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
  })
})

describe('when adding a blog to the server:', () => {
  test('it successfully saves to the server', async () => {
    let title = "temporary blog!" 
    let tmpBlog = new Blog({
      "title": title,
      "author": "temp mctemp-face",
      "url": "https://temporary-world.com",
      "likes": 0
    })
    await tmpBlog.save()
    let blogs = await helper.blogsInDb()
    expect(blogs.map(b => b.title)).toContain(title)
    // confirm if database has added a new item
    expect(blogs.length).toBe(helper.initialBlogs.length + 1) 
  }) 
  test('adds a default 0 likes if no likes are defined', async () => {
    let tmpBlog = {
      "title": "temporary blog!",
      "author": "temp mctemp-face",
      "url": "https://temporary-world.com"
    }
    let response = await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .send(tmpBlog)
    
    expect(response.body.likes).toBe(0)
  })
  test('returns a 201 status code with successful POST', async () => {
    let tmpBlog = {
      "title": "temporary blog!",
      "author": "temp mctemp-face",
      "url": "https://temporary-world.com"
    }
    await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .send(tmpBlog)
      .expect(201)  
  })  
})

describe ('fails with 400 status code if a blog is: ', () => {
  test('missing a title', async () => {
    let missingTitle = {
      // "title": "temporary blog!",
      "author": "temp mctemp-face",
      "url": "https://temporary-world.com"
    }
    await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .send(missingTitle)
      .expect(400)  
  })  

  test('missing a url', async () => {
    let missingUrl = {
      "title": "temporary blog!",
      "author": "temp mctemp-face",
      // "url": "https://temporary-world.com"
    }
    await api
      .post('/api/blogs')
      .set('Content-Type', 'application/json')
      .send(missingUrl)
      .expect(400)      
  })    
}) 

describe ('when deleting a single blog post:', () => {
  test('the response has a 204 status code', async () => {
    let blogs = await helper.blogsInDb()
    let id = blogs[0].id // get id of first blog
    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)
  })
  test('the response has a 204 status code even with non-existent id', async () => {
    let nonExId = await helper.getNonExistentId()
    // proof of consistent 204
    await api
      .delete(`/api/blogs/${nonExId}`)
      .expect(204)
    
    // proof of non-existent deletion (no effect)
    let blogs = await helper.blogsInDb()
    expect(blogs.length).toBe(helper.initialBlogs.length)
  })
  test('no blogs are returned (RESTful)', async () => {
    let blogs = await helper.blogsInDb()
    let id = blogs[0].id // get id of first blog   
    let response = await api.delete(`/api/blogs/${id}`)
    // deep obj equality
    expect(response.body).toEqual({})
  })
  test('that blog post is successfully deleted on the database', async () => {
    let blogs = await helper.blogsInDb()
    let id = blogs[0].id
    await api.delete(`/api/blogs/${id}`)
    // re-request
    blogs = await helper.blogsInDb()
    // then check for the length of new blogs
    expect(blogs.length).toBe(helper.initialBlogs.length - 1) 
  })
}) 

afterAll(() => {
  mongoose.connection.close()
})