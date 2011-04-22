var _sys = require('sys');

module.exports = function call(_client, _assert, _test, _done_responses) {
  /**
   * Does an http call
   *
   * @private
   *
   * @see TESTOREONE#[http_method]
   *
   * @param {Object} [req=undefined]
   *  Request object
   * @param {Object} [res=undefined]
   *  Response object
   * @param {Function} [cb=undefined]
   *  Callback after the http call is done
   *
   * @returns
   *   undefined
   */

  return function call(req, res, cb) {

    // Callback as third or fourth arg
    if (typeof res === 'function') {
      cb = res;
    } else {
      if (typeof cb !== 'function') {
        cb = function () {};
      }
    }

    // Issue request
    var timer,
        method = req.method || 'GET',
        status = res.status || res.statusCode,
        data = req.data || req.body,
        requestTimeout = req.timeout || 0,
        headers = req.headers || {},
        request;

    if (data && typeof data === 'object') {
      data = require('querystring').stringify(data);

      if (req.method === 'POST') {
        headers['content-type'] = headers['content-type'] || 'application/x-www-form-urlencoded';
      }
    }

    if (req.query && typeof req.query === 'object') {
      req.url = req.url + '?' + require('querystring').stringify(req.query);
    }

    request = _client.request(method, req.url, headers);

    if (data) {
      request.write(data);
    }

    // Timeout
    if (requestTimeout) {
      timer = setTimeout(function () {
        delete req.timeout;
        _assert.fail('Request timed out after ' + requestTimeout + 'ms.');
      }, requestTimeout);
    }

    request.addListener('response', function (response) {
      response.body = '';
      response.setEncoding('utf8');
      response.addListener('data', function (chunk) {
        response.body += chunk;
      });

      response.addListener('end', function () {
        if (timer) {
          clearTimeout(timer);
        }

        // Assert response body
        if (res.body !== undefined) {
          var eql = res.body instanceof RegExp
              ? res.body.test(response.body)
              : res.body === response.body;

          _assert.ok(
            eql,
            'Invalid response body.\n'.grey +
            '    Expected: '.grey + _sys.inspect(res.body).toString().green + '\n' +
            '    Got: '.grey + _sys.inspect(response.body).toString().red
          );
        }

        // Assert response status
        if (typeof status === 'number') {
          _assert.equal(
            response.statusCode,
            status,
            'Invalid response status code.\n'.grey +
            '    Expected: '.grey + status.toString().green + '\n' +
            '    Got: '.grey + response.statusCode.toString().red
          );
        }

        // Assert response headers
        if (res.headers) {
          (function () {
            var keys = Object.keys(res.headers),
                len = keys.length,
                i, name, actual, expected, eql;
            for (i = 0; i < len; ++i) {
              name = keys[i];
              actual = response.headers[name.toLowerCase()];
              expected = res.headers[name];
              eql = expected instanceof RegExp ? expected.test(actual) : expected === actual;
              _assert.ok(
                eql,
                  'Invalid response header '.grey + name.toString().bold + '\n' +
                  '    Expected: '.grey + expected.toString().green + '\n' +
                  '    Got: '.grey + actual.toString().red
              );
            }
          }());
        }

        // Callback
        cb(response);

        _done_responses += 1;
        _test();
      });
    });

    request.end();
  };
};
