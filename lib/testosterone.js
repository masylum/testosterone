exports = function (server, config) {
    var client = http.createClient(config.port || 3000),
        testosterone = {};

    /**
     * Makes an http call to `server` with
     * the given `req` object and `res` assertions object.
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} callback
     */

    testosterone.call = function(req, res, callback){
        var timer,
            method = req.method || 'GET',
            status = res.status || res.statusCode,
            data = req.data || req.body,
            requestTimeout = req.timeout || 0,
            request = client.request(method, req.url, req.headers);

        callback = callback || function(){};

        // Timeout
        if (requestTimeout) {
            timer = setTimeout(function(){
                server.close();
                delete req.timeout;
                assert.fail(msg + 'Request timed out after ' + requestTimeout + 'ms.');
            }, requestTimeout);
        }

        if (data) request.write(data);

        request.addListener('response', function(response){
            response.body = '';
            response.setEncoding('utf8');
            response.addListener('data', function(chunk){ response.body += chunk; });
            response.addListener('end', function(){
                server.close();
                if (timer) clearTimeout(timer);

                // Assert response body
                if (res.body !== undefined) {
                    var eql = res.body instanceof RegExp
                      ? res.body.test(response.body)
                      : res.body === response.body;
                    assert.ok(
                        eql,
                        msg + 'Invalid response body.\n'
                            + '    Expected: ' + sys.inspect(res.body) + '\n'
                            + '    Got: ' + sys.inspect(response.body)
                    );
                }

                // Assert response status
                if (typeof status === 'number') {
                    assert.equal(
                        response.statusCode,
                        status,
                        msg + colorize('Invalid response status code.\n'
                            + '    Expected: [green]{' + status + '}\n'
                            + '    Got: [red]{' + response.statusCode + '}')
                    );
                }

                // Assert response headers
                if (res.headers) {
                    var keys = Object.keys(res.headers);
                    for (var i = 0, len = keys.length; i < len; ++i) {
                        var name = keys[i],
                            actual = response.headers[name.toLowerCase()],
                            expected = res.headers[name],
                            eql = expected instanceof RegExp
                              ? expected.test(actual)
                              : expected == actual;
                        assert.ok(
                            eql,
                            msg + colorize('Invalid response header [bold]{' + name + '}.\n'
                                + '    Expected: [green]{' + expected + '}\n'
                                + '    Got: [red]{' + actual + '}')
                        );
                    }
                }

                // Callback
                callback(response);
            });
        });
        request.end();
    };

    return testosterone;
};
