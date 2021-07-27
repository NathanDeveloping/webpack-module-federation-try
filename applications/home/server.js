const fastify = require('fastify');
const serveStatic = require('serve-static');
const config = require('config');
const logger = require('tada-logger');
const path = require('path');
const fs = require('fs');
const http = require('http');

/**
 * HTTP agent, used to support self-signed certificate
 */
const httpAgent = new http.Agent({
  rejectUnauthorized: false
});


const app = fastify();

// Logger middleware
app.addHook('onRequest', (req, res, done) => {
  logger.info(`route call ${req.raw.method} => ${req.raw.url} `);
  done();
});

// App routes
app.get('/*', (req, res) => {
  const stream = fs.createReadStream(
    path.join(__dirname, 'dist', 'index.html')
  );
  res.type('text/html').send(stream);
});

// Exported routes
app.get('/config', (_req, res) => {
  res.send(config);
});

// Static files served
app.use(serveStatic(path.join(__dirname, 'dist')));

app.listen(config.get('server.port'), config.get('server.host'), () => {
  logger.info(
    `< Application.bootstrap > Server started at: ${config.get(
      'server.host'
    )}:${config.get('server.port')}`
  );
});
