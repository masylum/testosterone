var app = require('./app'),
    testosterone = require('testosterone')(),
    assert = testosterone.assert;

testosterone
  .get('/', function (res) {
    assert.equal(res.statusCode, 200)
  })

  .get('/hi', function (res) {
    assert.equal(res.statusCode, 500);
    assert.equal(res.body, 'use post instead');
  })

  .post('/hi', {data: {message: 'hola'}}, {
    status: 200,
    body: 'hola'
  });
