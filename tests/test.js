var testosterone = require('../lib/testosterone')({port: 3000}),
    assert = testosterone.assert;

testosterone
  // test async get
  .get('/', function (res) {
    assert.equal(res.statusCode, 200);
  })

  // test sync get
  .get('/hi', function (res) {
    assert.equal(res.statusCode, 500);
    assert.equal(res.body, 'use post instead');
  })

  // test get with params
  .get('/hi', {query: {hello: true}}, function (res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello!');
  })

  // test get with params
  .get('/hi?hello=true', function (res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello!');
  })

  // test async post with response object
  .post('/hi', {}, {status: 200, body: 'message'})

  // test async post with response object and callback
  .post('/hi', {}, {status: 200, body: 'message'}, function (res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'message');
  })

  // test async post with data, response object and callback
  .post('/hi', {data: {message: 'hola'}}, {status: 200, body: 'hola'}, function (res) {
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'hola');
  });
