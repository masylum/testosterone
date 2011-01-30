var testosterone = require('./..')({post: 3000, title: 'Testing with stubs', quiet: true}),
    gently = new (require('gently')),
    fs = require('fs'),
    assert = testosterone.assert;

testosterone
  .add('GIVEN foo.txt \nWHEN its empty \nTHEN it return null', function (spec) {
    gently.expect(fs, 'readFile', function (path, encoding, cb) {
      assert.equal(path, 'foo.txt');
      cb(null, null);
    });

    spec();
    fs.readFile('foo.txt', 'utf-8', function (er, data) {
      assert.equal(er, null);
      assert.equal(data, null);
    });
  })

  .add('GIVEN foo.txt \nWHEN it have content \nTHEN it return that content', function (spec) {
    gently.expect(fs, 'readFile', function (path, encoding, cb) {
      assert.equal(path, 'foo.txt');
      cb(null, 'foo');
    });

    spec();
    fs.readFile('foo.txt', 'utf-8', function (er, data) {
      assert.equal(er, null);
      assert.equal(data, 'foo');
    });
  })

  .serial(function () {
    require('sys').print('done!');
  });
