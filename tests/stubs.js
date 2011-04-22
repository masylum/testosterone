var testosterone = require('./..')({post: 3000, title: 'Testing with stubs', quiet: true}),
    gently = new (require('gently')),
    fs = require('fs'),
    assert = testosterone.assert;

testosterone
  .add('GIVEN foo.txt \nWHEN its empty \nTHEN it return null', function (next) {
    gently.expect(fs, 'readFile', function (path, encoding, cb) {
      assert.equal(path, 'foo.txt');
      cb(null, null);
    });

    fs.readFile('foo.txt', 'utf-8', function (er, data) {
      assert.equal(er, null);
      assert.equal(data, null);
      next();
    });
  })

  .add('GIVEN foo.txt \nWHEN it have content \nTHEN it return that content', function (next) {
    gently.expect(fs, 'readFile', function (path, encoding, cb) {
      assert.equal(path, 'foo.txt');
      cb(null, 'foo');
    });

    fs.readFile('foo.txt', 'utf-8', function (er, data) {
      assert.equal(er, null);
      assert.equal(data, 'foo');
      next();
    });
  })

  .run(function () {
    require('sys').print('done!');
  });
