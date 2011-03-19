var express = require('express'),
    app = express.createServer();

app.use(express.bodyParser());

app.get('/', function (req, res) {
  setTimeout(function () {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
  }, 200);
});

app.get('/hi', function (req, res) {
  if (req.param('hello') !== undefined) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello!');
  } else {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('use post instead');
  }
});

app.post('/hi', function (req, res) {
  setTimeout(function () {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(req.param('message') || 'message');
  }, 100);
});

app.listen(3000);

module.exports = app;
