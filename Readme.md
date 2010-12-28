# testosterone

This module is under construction.

        var app = require('./your_http_web_app');

        require('testosterone)(app)
            .GET('/', function (res) {
                assert.equal(res.statusCode, 200)
            ;})

            .POST('/', function (res) {
                assert.equal(res.statusCode, 500);
            })

            .GET('/api/token', [
                {data: {token: 'foo'}},
                {data: {token: 'bar'}}
            ], [
                {status: 500, body: 'error'},
                {status: 200, body: 'ok'}
            ]);

        Output =>

            GET  /
              ✓ 1 assert

            POST /
              ✓ 1 assert

            GET  /api/token
              ✓ 3 assert

            ✓ OK » 7 viril • 0 pending
