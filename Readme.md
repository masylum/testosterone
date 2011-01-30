# ✿ Testosterone

Virile testing for http servers or any nodejs application.

Testosterone is built on nodejs but it allows you to test any http server.

## Installation

`npm install testosterone`

## WhateverDrivenDevelopment

Testosterone allows you to follow BDD or TDD on any of your projects using
the same testing library.

You can run your tests in parallel or serial. Running tests in parallel can
be a painful experience if you use stubs.

## Options

- `host` _(localhost)_ : Host to do the http calls.
- `port` _(80)_ : Host to do the http calls.
- `quiet` _(false)_ : Ninja mode.
- `title` _(Testosteron)_ : Test title, it will be printed out.

## API

_testosterone_ is simple and flexible.

- `get|post|head|put|delete...(url, req, response, cb)`: Does a http call with the given request. If a response is given, testosterone will assert that the real response matches.
- `add(spec, resolve)`: Adds a test. The `spec` will be printed when `resolve` function is called. You can use `resolve` to curry a function.
- `serial(cb)`: Runs the tests in serial, if you use stubs this options will be very handy. `cb` will be called once all the `resolve` functions are executed.
- `parallel(cb)`: Runs the tests in parallel. `cb` will be called once all the `resolve` functions are executed.
- `assert`: Using this assert object instead of the native one will allow you to count and print the assertions.

## Usage

Use the returned object to do http calls with a sinatra-like-chainable syntax.

If you want the virilest experiencie, use `testosterone.assert` instead of the native assert.

## Show me the code

Chained example:

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

Serial example with [gently](https://github.com/felixge/node-gently.git) stubbing:

    var testosterone = require('testosterone')({post: 3000, title: 'Testing with stubs'}),
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

    // Output

    $ node test.js

    ✿ Testing with stubs :
    GIVEN foo.txt
    WHEN its empty
    THEN it return null
    ✓ ✓ ✓

    GIVEN foo.txt
    WHEN it have content
    THEN it return that content
    ✓ ✓ ✓
    » 0 responses, 6 asserts

## Test

In order to run the tests type:

    make test_app
    make

## Credits

The *_call* function of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso) response assert done by TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
