#!/usr/bin/env node

/*
server.js: launches a static file web server from the current folder

make executable with `chmod +x ./server.js`
run with `./server.js [port]`
where `[port]` is an optional HTTP port (8888 by default)

Serves the correct MIME type and defaults to index.html
*/
(function(){

'use strict';

var
  http = require('http'),
  url = require('url'),
  path = require('path'),
  fs = require('fs'),
  port = parseInt(process.argv[2] || 8888, 10),
  mime = {
    '.html': 'text/html',
    '.htm':  'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.jp':   'image/jpeg',
    '.png':  'image/png',
    '.gif':  'image/gif',
    '.ico':  'image/x-icon',
    '.svg':  'image/svg+xml',
    '.txt':  'text/plain'
  };

// new server
http.createServer(function(req, res) {

  var
    uri = url.parse(req.url).pathname,
    filename = path.join(process.cwd(), uri);

  // file available?
  fs.access(filename, fs.constants.R_OK, function(err) {

    // not found
    if (err) {
      serve(404, '404 Not Found\n');
      return;
    }

    // index.html default
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    // read file
    fs.readFile(filename, function(err, file) {

      if (err) {
        // error reading
        serve(500, err + '\n');
      }
      else {
        // return file
        serve(200, file, mime[path.extname(filename)]);
      }

    });
  });

  // serve content
  function serve(code, content, type) {
    res.writeHead(code, { 'Content-Type': type || mime['.txt'] });
    res.write(content);
    res.end();
  }

}).listen(port);

console.log('Server running at http://localhost:' + port);

}());
