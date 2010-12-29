# ✿ Testosterone

Easy testing for virile http servers.

Testosterone is built on nodejs but it allows you to test any http server.

## Installation

`npm install testosterone`

## How does it work?

Call testosterone with two optional options:

- host _(localhost)_
- port _(80)_

Use the returned object to do http calls with a sinatra-like-chainable syntax.

If you want the virilest experiencie, replace nodejs assert with `testosterone.assert`

## Show me the code

Example:

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

Then you run it:

    $ node example/test.js

    ✿ Testosterone
    ✓ ✓ ✓ ✓ ✓
    » 3 responses, 5 asserts

## Credits

The *core* of this library is a shameless copy from [expresso](https://github.com/visionmedia/expresso) response assert done by TJ Holowaychuk ([visionmedia](http://github.com/visionmedia))
