const config = require('./utils/config')
const app = require('./app') // express application
const http = require('http')
const logger = require('./utils/logger')

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server now running @ PORT: ${config.PORT}`);
})
