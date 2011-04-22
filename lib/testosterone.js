/*
 * testosterone - Virile testing for http servers or any nodejs application.
 * Copyright(c) 2011 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */
module.exports = function (config) {
  require('colors');

  var _sys = require('sys'),
      _eventEmitter = new (require('events').EventEmitter)(),

      _specs = [],

      _config = config || {},
      _client = require('http').createClient(
        _config.port || 80,
        _config.host || 'localhost'
      ),

      _count_responses = 0,
      _done_responses = 0,

      _count_asserts = 0,
      _passed_asserts = 0,

      TESTOSTERONE = {},

      _parseSpec = function (spec) {
        var specs = spec.split('\n').map(function (spec) {
          spec = spec.replace(/(GIVEN|WHEN|AND|THEN)/g, '$1'.magenta + '\033[90m');
          spec = spec.replace(/`([^`]*)`/g, '$1'.blue + '\033[90m');
          return spec;
        });
        return '\033[90m' + specs.join('\n');
      },

      _assert = (function () {
        var assert = require('assert'),
            functions = Object.keys(assert),
            a = {};

        functions.forEach(function (fn) {
          if (typeof require('assert')[fn] === 'function') {
            a[fn] = function (_) {
              _count_asserts += 1;
              try {
                require('assert')[fn].apply(this, Array.prototype.slice.call(arguments, 0));
              } catch (exc) {
                _sys.print(('\n✗ => ' + exc.stack + '\n').red);
                process.exit();
              }
              _passed_asserts += 1;
              _sys.print('✓ '.green);
            };
          }
        });

        return a;
      }()),

      /**
       * Tests if all the requests are done and prints a message
       *
       * @private
       *
       * @returns
       *   undefined
       */

      _test = function () {
        if (_count_responses === _done_responses) {
          if (!_config.quiet) {
            if (_count_responses > 0) {
              _sys.print(('\n\n» ' + _done_responses + ' responses, ' + _passed_asserts + ' asserts\n\n').yellow);
            } else {
              _sys.print(('\n\n» ' + _passed_asserts + ' asserts\n\n').yellow);
            }
          } else {
            _sys.print('\n\n');
          }
          process.exit();
        }
      },

      _call = require('./helpers/call')(_client, _assert, _test, _done_responses);

  _config.sync = _config.sync || false;

  /**
   * Does a testable http call
   *
   * @param {String} [route=undefined]
   *   http uri to test
   * @param {Object} [req=undefined]
   *   Object containing request related attributes like headers or body.
   * @param {Object} [res=undefined]
   *   Object to compare with the response of the http call
   * @param {Function} [cb=undefined]
   *   Callback that will be called after the http call. Receives the http response object.
   *
   * @returns
   *   Testosterone, so you can chain http calls.
   */
  ['get', 'post', 'head', 'put', 'delete', 'trace', 'options', 'connect'].forEach(function (http_method) {
    // refactor this a little bit
    TESTOSTERONE[http_method] = function (route, req, res, cb) {
      _count_responses += 1;
      if (typeof req === 'function') {
        cb = req;
        res = {};
        req = {};
      }

      req.method = http_method.toUpperCase();
      req.url = req.url || route;
      _call(req, res, cb);

      return TESTOSTERONE;
    };
  });

  /**
   * Listens for a `beforeTest` of `afterTest` event
   *
   * @param {Function} [listener]
   *
   * @returns
   *   Testosterone
   */
  ['before', 'after'].forEach(function (event) {
    TESTOSTERONE[event] = function (listener) {
      _eventEmitter.on(event + 'Test', listener);
      return TESTOSTERONE;
    };
  });

  /**
   * Adds a function to be called
   *
   * @see #serial
   *
   * @param {String} [spec='']
   *   Specification. Will be printer once `done` is called.
   * @param {Function} [done=undefined]
   *   This function prints the spec and also tracks if the test is done.
   *   This allows to work with asyncronous tests.
   *
   * @returns
   *   Testosterone
   */
  TESTOSTERONE.add = function (spec, body) {
    _specs.push({spec: spec, body: body});
    return TESTOSTERONE;
  };

  /**
   * Runs all the added tests in serial.
   *
   * @see #add
   *
   * @param {Function} [cb=undefined]
   *   Callback that is run after all the `done` callbacks are run.
   *
   * @returns
   *   Testosterone
   */
  TESTOSTERONE.serial = TESTOSTERONE.run = function (cb) {
    cb = cb || function () {};

    (function next() {
      if (_specs.length > 0) {
        var spec = _specs.shift();

        if (!_config.quiet) {
          _sys.print('\n\n' + _parseSpec(spec.spec) + ' => '.yellow);
        }

        _eventEmitter.emit('beforeTest');

        if (_config.sync) {
          spec.body.call(spec.body);
          _eventEmitter.emit('afterTest');
          next();
        } else {
          spec.body.call(spec.body, function done(fn) {
            // curry
            if (fn) {
              return function () {
                fn.apply(fn, arguments);
                _eventEmitter.emit('afterTest');
                next();
              };
            } else {
              _eventEmitter.emit('afterTest');
              next();
            }
          });
        }
      } else {
        cb.call(cb, arguments);
        _test();
      }
    }());

    return TESTOSTERONE;
  };

  TESTOSTERONE.assert = _assert;

  if (!_config.quiet) {
    _sys.print(('✿ ' + (_config.title || 'Testosterone') + ' :').inverse.yellow + ' ');
  }

  return TESTOSTERONE;
};
