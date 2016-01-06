/**
 * Simple testserver.
 */
var http = require('http');
var routes = require('./routes');

http.createServer(function server(req, res) {
  if (routes[req.url] && typeof routes[req.url] === 'function') {
    routes[req.url](req, res);
  } else {
    res.writeHead(404, http.STATUS_CODES[404]);
    res.write('Page not found.');
    res.end();
  }
}).listen(8000, '127.0.0.1');
