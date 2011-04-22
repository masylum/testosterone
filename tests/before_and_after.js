var testosterone = require('../lib/testosterone')({port: 3000, title: 'Before and After'}),
    add = testosterone.add,
    count = 0,
    assert = testosterone.assert;

testosterone

  .before(function () {
    console.log('before called');
    count++;
  })

  .after(function () {
    console.log('after called');
  })

  .add('`first` test', function (next) {
    assert.equal(count, 1);

    count++;

    setTimeout(function () {
      assert.equal(count, 2);
      next();
    }, 100);
  })

  .add('and this is a `second` test', function (done) {
    setTimeout(done(function () {
      assert.equal(count, 3);
    }), 200);
  })

  .run();
