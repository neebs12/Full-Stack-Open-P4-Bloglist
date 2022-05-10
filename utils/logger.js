// note the rest(@parameter) and spread(@argument) syntax
const info = (...msg) => {
  console.log(...msg)
}

const error = (...error) => {
  console.error(...error)
}

module.exports = {
  info, error,
}