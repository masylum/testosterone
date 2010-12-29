# ✿ Testosterone

Synchronous testing for virile http servers.

## Installation

`npm install testosterone`

## How does it work?

Testosterone is built on nodejs but it allows you to test any http server.

The core of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso.git) response assert.

## Options

Testosterone accepts two options:

- host _(localhost)_
- port _(80)_

If you want the virilest experiencie, replace nodejs assert with `testosterone.assert`

## Show me the code

Example:

    var testosterone = require('../lib/testosterone')({post: 3000}),
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
