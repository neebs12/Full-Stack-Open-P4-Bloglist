const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acm, blog) => acm += blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let indOfMax = 0;
  blogs.forEach((blog, blogInd) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      indOfMax = blogInd
    }
  })
  return blogs[indOfMax]
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog
}