var testosterone = require('../lib/testosterone')({port: 3000, title: 'Core Testosterone'}),
    add = testosterone.add,
    order = 0,
    assert = testosterone.assert;

testosterone
  .add(
    'GIVEN a GET async thing \n' +
    'WHEN something happens \n' +
    'THEN it should bla',

    function (cb) {
      testosterone.get('/', cb(function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(order, 0);
        order++;
      }));
    }
  )

  .add(
    'GIVEN a GET sync thing \n' +
    'WHEN something happens \n' +
    'THEN it should bla',

    function (cb) {
      testosterone.get('/hi', {query: {hello: true}}, cb(function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.body, 'Hello!');
        assert.equal(order, 1);
        order++;
      }));
    }
  )

  .add(
    'GIVEN a POST async thing \n' +
    'WHEN something happens \n' +
    'THEN it should bla',

    function (cb) {
      testosterone.post('/hi', {data: {message: 'hola'}}, cb(function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.body, 'hola');
        assert.equal(order, 2);
        order++;
      }));
    }
  )

  .run(function () {
    require('sys').print('done!');
  });
