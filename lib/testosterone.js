module.exports = function (config) {
  config = config || {};

  // extend assert
  var client = require('http').createClient(config.port || 3000),
      sys = require('sys'),
      testosterone = {},

      count_responses = 0,
      done_responses = 0,

      count_asserts = 0,
      passed_asserts = 0,

      colorize = function (str) {
        var colors = { bold: 1, red: 31, green: 32, yellow: 33, grey: 30 };
        return str.replace(/\[(\w+)\]\{([^]*?)\}/g, function (_, color, str) {
          return '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
        });
      },

      test = function () {
        if (count_responses === done_responses) {
          sys.print(_colorize('\n[grey]{» ' + done_responses + ' responses, ' + passed_asserts + ' asserts}\n'));
          process.exit();
        }
      },

      assert = (function () {
        var assert = require('assert'),
            functions = Object.keys(assert),
            a = {};

        functions.forEach(function (fn) {
          if (typeof require('assert')[fn] === 'function') {
            a[fn] = function (_) {
              count_asserts += 1;
              try {
                require('assert')[fn].apply(this, Array.prototype.slice.call(arguments, 0));
              } catch (exc) {
                sys.print(_colorize('\n[red]{✗ => ' + exc.stack + '}\n'));
                process.exit();
              }
              passed_asserts += 1;
              sys.print(_colorize('[green]{✓} '));
            };
          }
        });

        return a;
      }()),

      /**
       * Do an http call with
       * the given `req` object and `res` assertions object.
       *
       * @param {Object} req
       * @param {Object|Function} res
       */

      call = function (req, res, callback) {

        // Callback as third or fourth arg
        if (typeof res === 'function') {
          callback = res;
        } else {
          if (typeof callback !== 'function') {
            callback = function () {};
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

        if (data) {
          if (typeof data === 'object') {
            data = require('querystring').stringify(data);
            headers['content-type'] = headers['content-type'] || 'application/x-www-form-urlencoded';
          }
        }

        request = client.request(method, req.url, headers);

        if (data) {
          request.write(data);
        }

        // Timeout
        if (requestTimeout) {
          timer = setTimeout(function () {
            delete req.timeout;
            assert.fail('Request timed out after ' + requestTimeout + 'ms.');
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

              assert.ok(
                eql,
                'Invalid response body.\n' +
                '    Expected: ' + sys.inspect(res.body) + '\n' +
                '    Got: ' + sys.inspect(response.body)
              );
            }

            // Assert response status
            if (typeof status === 'number') {
              assert.equal(
                response.statusCode,
                status,
                colorize(
                  'Invalid response status code.\n' +
                  '    Expected: [green]{' + status + '}\n' +
                  '    Got: [red]{' + response.statusCode + '}'
              ));
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
                  assert.ok(
                    eql,
                    colorize(
                      'Invalid response header [bold]{' + name + '}.\n' +
                      '    Expected: [green]{' + expected + '}\n' +
                      '    Got: [red]{' + actual + '}'
                    )
                  );
                }
              }());
            }

            // Callback
            callback(response);
            done_responses += 1;
            test();
          });
        });
        request.end();
      };

  ['get', 'post'].forEach(function (method) {
    testosterone[method] = function (route, req, res, callback) {
      count_responses += 1;
      test();
      if (typeof req === 'function') {
        callback = req;
        res = {};
        req = {};
      }
      req.method = method.toUpperCase();
      req.url = req.url || route;
      call(req, res, callback);
      return testosterone;
    };
  });

  testosterone.assert = assert;
  sys.print(colorize('[yellow]{✿ Testosterone}\n'));

  return testosterone;
};
