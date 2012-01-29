/*
 * testosterone - Virile testing for http servers or any nodejs application.
 * Copyright(c) 2011 Pau Ramon <masylum@gmail.com>
 * MIT Licensed
 */
require('colors');

module.exports = function (config) {

  var _util = require('util')
    , _ = require('underscore')
    , _specs = []

    , _responses = {count: 0, done: 0}

    , _count_asserts = 0
    , _passed_asserts = 0

    , _before
    , _after
    , _call
    , _config
    , _time = Date.now()

    , TESTOSTERONE = {}

    , _assert = (function () {
        var new_assert = {};

        Object.keys(require('assert')).forEach(function (fn) {
          if (typeof require('assert')[fn] === 'function') {
            new_assert[fn] = function (_) {
              _count_asserts += 1;

              try {
                require('assert')[fn].apply(this, [].slice.call(arguments, 0));
              } catch (exc) {
                console.error(('\n✗ => ' + exc.stack + '\n').red);
                process.exit();
              }
              _passed_asserts += 1;
              _util.print('✓ '.green);
            };
          }
        });

        return new_assert;
      }());

  /**
   * Tests if all the requests are done and prints a message
   *
   * @private
   */
  function _test() {
    if (_responses.count === _responses.done) {
      if (!_config.output.specs) {
        console.log('');
      }
      if (_config.output.summary) {
        if (_responses.count > 0) {
          console.log(('» ' + _responses.done + ' responses, ' + _passed_asserts
                     + ' asserts, ' + ((Date.now() - _time) / 1000).toFixed(2) + 's').yellow);
        } else {
          console.log(('» ' + _passed_asserts + ' asserts, ' + ((Date.now() - _time) / 1000).toFixed(2) + 's').yellow);
        }
      }
    }
  }

  /**
   * Colorizes the output of the specs if the `verbose` options is selected
   *
   * @private
   */
  function _parseSpec(spec) {
    var specs = spec.split('\n').map(function (spec) {
      spec = spec.replace(/(GIVEN|WHEN|AND|THEN)/g, '$1'.magenta + '\033[90m');
      spec = spec.replace(/`([^`]*)`/g, '$1'.blue + '\033[90m');
      return spec;
    });
    return '\033[90m' + specs.join('\n');
  }

  // defaults
  _config = _.extend({
    port: 80
  , host: 'localhost'
  , title: 'Testosterone'
  , sync: false
  }, config);

  // defaults
  _config.output = _.extend({
    specs: true
  , ticks: true
  , summary: true
  , title: true
  }, config.output);

  _call = require('./helpers/call')(_config, _assert, _test, _responses);

  if (_config.output.title) {
    console.log(('✿ ' + (_config.title) + ' :').inverse.yellow + ' ');
  }

  TESTOSTERONE.assert = _assert;

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
   *   Testosterone
   */
  ['get', 'post', 'head', 'put', 'delete', 'trace', 'options', 'connect'].forEach(function (http_method) {
    // refactor this a little bit
    TESTOSTERONE[http_method] = function (route, req, res, cb) {
      _responses.count += 1;
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
   * Hook triggered before each test
   *
   * @param {Function} listener
   *
   * @returns
   *   Testosterone
   */
  TESTOSTERONE.before = function (callback) {
    _before = callback;
    return TESTOSTERONE;
  };

  /**
   * Hook triggered after each test
   *
   * @param {Function} listener
   *
   * @returns
   *   Testosterone
   */
  TESTOSTERONE.after = function (callback) {
    _after = callback;
    return TESTOSTERONE;
  };

  /**
   * Adds a function to be called
   *
   * @param {String} spec
   *   Specification. Will be printer once `done` is called.
   * @param {Function} body
   *   The body of the spec
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
   * @param {Function} cb
   *   Optional callback that is run after all the `done` callbacks are run.
   *
   * @returns
   *   Testosterone
   */
  TESTOSTERONE.run = function (cb) {
    var next, after, runTest;

    cb = cb || function () {}; // noop

    next = function next() {
      if (_specs.length) {
        var spec = _specs.shift();

        if (_config.output.specs) {
          _util.print(_parseSpec(spec.spec).yellow);

          if (_config.output.ticks) {
            _util.print(' => '.yellow);
          }
        }

        // run before
        if (_before) {
          if (_before.length) {
            _before(function () {
              runTest(spec);
            });
          } else {
            _before();
            runTest(spec);
          }
        } else {
          runTest(spec);
        }

      } else {
        _test();
        cb.call(cb, arguments);
      }
    };

    after = function after() {
      if (_config.output.specs) {
        console.log('\n');
      }

      // run after
      if (_after) {
        if (_after.length) {
          _after(next);
        } else {
          _after();
          next();
        }
      } else {
        next();
      }
    };

    runTest = function runTest(spec) {
      if (_config.sync) {
        spec.body.call(spec.body);
        after();
      } else {
        spec.body.call(spec.body, function done(fn) {
          // curry
          if (fn) {
            return function () {
              fn.apply(fn, arguments);
              after();
            };
          } else {
            after();
          }
        });
      }
    };

    next();

    return TESTOSTERONE;
  };

  return TESTOSTERONE;
};
