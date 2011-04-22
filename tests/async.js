var testosterone = require('../lib/testosterone')({port: 3000, title: 'Async Testosterone'}),
    add = testosterone.add,
    order = 0,
    assert = testosterone.assert;

testosterone
  .add('`first` test', function (next) {
    assert.equal(order, 0);
    setTimeout(function () {
      next();
      assert.equal(order, 0);
      order++;
    }, 100);
  })

  .add('and this is a `second` test', function (done) {
    setTimeout(done(function () {
      assert.equal(order, 1);
      order++;
    }), 200);
  })

  .run();
