# ✿ Testosterone

Virile testing for http servers or any nodejs application.

Testosterone is built on nodejs but it allows you to test any http server.

## Installation

`npm install testosterone`

## WhateverDrivenDevelopment

Testosterone allows you to follow BDD or TDD on any of your projects using
the same testing library.

<img src = "https://github.com/masylum/testosterone/raw/master/testosterone.png" border = "0" />

## Options

- `host` _(localhost)_ : Host to do the http calls.
- `port` _(80)_ : Host to do the http calls.
- `quiet` _(false)_ : Ninja mode.
- `title` _(Testosterone)_ : Test title, it will be printed out.
- `sync` _(false)_ : If set to true, you don't need to call `done` to specify when your tests are done.

## API

_testosterone_ is simple and flexible.

- `get|post|head|put|delete...(url, req, response, cb)`: Does a http call with the given request. If a response is given, testosterone will assert that the real response matches.
- `add(spec, function(done))`: Adds a test. The test is considered executed when `done` function is called. You can use `done` to curry a function.
- `before(function)`: Listener for fired events before a test runs.
- `after(function)`: Listener for fired events after a test runs.
- `run(cb)`: Runs the tests in serial. `cb` will be called once all the tests are executed.
- `assert`: Using this assert object instead of the native one will allow you to count and print the assertions.

## Show me the code

You have more examples on the `test` folder:

### HTTP testing example:

    var testosterone = require('testosterone')({post: 3000}),
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

    // Output

    $ node test.js

    ✿ Testosterone : ✓ ✓ ✓ ✓ ✓
    » 3 responses, 5 asserts

### Asynchronous example:

    var testosterone = require('testosterone')({post: 3000, title: 'Testing async'}),
        gently = new (require('gently')),
        assert = testosterone.assert;

    testosterone

      .before(function () {
        console.log('test about to run!');
      })

      // using done to tell testosterone when the test is done
      .add('First test', function (done) {
        setTimeout(function () {
          assert.ok(true);
          done();
        }, 999);
      })

      // same but currying
      .add('Second test', function (spec) {
        assert.ok(true);

        setTimeout(done(function () {
          assert.ok(true);
        }), 10);
      })

      .run(function () {
        require('sys').print('All tests passed!');
      });

    // Output

    $ node test.js

    ✿ Testing async :

    First test => ✓
    Second test => ✓ ✓

    » 0 responses, 3 asserts

### Example with [gently](https://github.com/felixge/node-gently.git) stubbing and `sync: true`:

    var testosterone = require('testosterone')({post: 3000, title: 'Testing with stubs', sync: true}),
        gently = new (require('gently')),
        fs = require('fs'),
        assert = testosterone.assert;

    testosterone
      .add('GIVEN foo.txt \nWHEN its empty \nTHEN it return null', function (spec) {
        gently.expect(fs, 'readFile', function (path, encoding, cb) {
          assert.equal(path, 'foo.txt');
          cb(null, null);
        });

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

        fs.readFile('foo.txt', 'utf-8', function (er, data) {
          assert.equal(er, null);
          assert.equal(data, 'foo');
        });
      })

      .run(function () {
        require('sys').print('done!');
      });

    // Output

    $ node test.js

    ✿ Testing with stubs :

    GIVEN foo.txt
    WHEN its empty
    THEN it return null => ✓ ✓ ✓

    GIVEN foo.txt
    WHEN it have content
    THEN it return that content => ✓ ✓ ✓

    » 0 responses, 6 asserts

## Test

In order to run the tests type:

    make test_app
    make

## Credits

The *_call* function of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso) response assert done by TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
