var testosterone = require('../lib/testosterone')({port: 3000, title: 'Testing synchronous', sync: true}),
    add = testosterone.add,
    order = 0,
    assert = testosterone.assert;

testosterone
  .add(
    'GIVEN a `first` sync `thing` \n' +
    'WHEN something `happens` \n' +
    'THEN it should bla',

    function (cb) {
      assert.equal(1, 1);
    }
  )

  .add(
    'GIVEN a `second` sync `thing` \n' +
    'WHEN something `happens` \n' +
    'THEN it should bla',

    function (cb) {
      for(var i = 0; i<100000000;i++) {
        // do nothing
      }
      assert.equal(2, 2);
    }
  )

  .add(
    'GIVEN a `third` sync `thing` \n' +
    'WHEN something `happens` \n' +
    'THEN it should bla',

    function (cb) {
      assert.equal(3, 3);
    }
  )

  .run(function () {
    require('sys').print('done!');
  });
