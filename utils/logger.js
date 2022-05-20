// note the rest(@parameter) and spread(@argument) syntax
const info = (...msg) => {
  // terminate early to not log anything
  if (process.env.NODE_ENV === "test") return;
  console.log(...msg)
}

const error = (...error) => {
  if (process.env.NODE_ENV === "test") return;
  console.error(...error)
}

module.exports = {
  info, error,
}