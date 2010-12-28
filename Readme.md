# ✿ Testosterone

Synchronous testing for virile http servers.

## How does it work?

The core of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso.git) response assert.

## Installation

`npm install testosterone`

## Show me the code

Example:

    var app = require('./app'),
        testosterone = require('../lib/testosterone')(),
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

Then you run it:

    $ node example/test.js

    ✿ Testosterone
    ✓ ✓ ✓ ✓ ✓
    » 3 responses, 5 asserts

## OMG! Synchronooous?

We all know that running tests on parallel is faster, but sometimes is a PITA.
