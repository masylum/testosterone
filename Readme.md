# ✿ Testosterone

Virile testing for http servers or any nodejs application.

## Installation

`npm install testosterone`

## WhateverDrivenDevelopment

Testosterone allows you to follow BDD or TDD on any of your projects using
the same testing library.

<img src = "https://github.com/masylum/testosterone/raw/master/testosterone.png" border = "0" />

## Options

  * `host`: Host to do the http calls. *localhost*
  * `port`: Port to do the http calls. *80*
  * `output`: Configure the amount of verbosity you want for your tests
    * `specs`: Print the specs *true*
    * `ticks`: Print the ✓ and ✗ ticks *true*
    * `summary`: Prints the summary *true*
    * `title`: Prints the title *true*
  * `title`: Test title, it will be printed out. *Testosterone*
  * `sync`: If set to `true`, you don't need to call `done` to specify when your tests are done. *false*

## API

_testosterone_ API is simple and flexible.

- `get|post|head|put|delete...(url, req, response, cb)`: Does a http call with the given request. If a response is given, testosterone will assert that the real response matches.
- `add(spec, function(done))`: Adds a test. The test is considered executed when `done` function is called.
- `before(function)`: Runs before each test.
- `after(function)`: Runs after each test.
- `run([cb])`: Runs the tests in serial. `cb` will be called once all the tests are executed.
- `assert`: You **must** use this assert object instead of the native one.

All the functions are chainable.

## Show me the code

You have more examples on the `test` folder:

### HTTP testing example:

``` javascript
var testosterone = require('testosterone')({port: 3000})
  , assert = testosterone.assert;

testosterone
  .get('/', function (res) {
    assert.equal(res.statusCode, 200)
  })

  .get('/hi', function (res) {
    assert.equal(res.statusCode, 500);
    assert.equal(res.body, 'use post instead');
  })

  .post('/hi', {data: {message: 'hola'}}, {
    status: 200
  , body: 'hola'
  });

// Output

$ node test.js

✿ Testosterone : ✓ ✓ ✓ ✓ ✓
» 3 responses, 5 asserts
```

### Asynchronous example:

``` javascript
var testosterone = require('testosterone')({post: 3000, title: 'Testing async'})
  , assert = testosterone.assert;

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
```

### Example with [gently](https://github.com/felixge/node-gently.git) stubbing and `sync: true`:

``` javascript
var testosterone = require('testosterone')({post: 3000, title: 'Testing with stubs', sync: true})
  , gently = new (require('gently'))
  , fs = require('fs')
  , assert = testosterone.assert;

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

» 6 asserts
```

## Test

In order to run the tests type:

``` bash
npm install
make test_app
make
```

## Credits

The *_call* function of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso) response assert done by TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
