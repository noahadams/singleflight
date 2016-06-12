var tap = require('tap');
var singleflight = require('../');

var asyncIdentityCalls = 0;
var asyncIdentity = function(val, callback) {
  asyncIdentityCalls += 1;
  setTimeout(function() {
    callback(null, val);
  }, 0);
}

module.exports = tap.test('async tests', function(t) {
  var wrapped = singleflight(asyncIdentity);
  var firstCallbackCalled = false;
  wrapped('test', function(error, key) {
    firstCallbackCalled = true;
    t.equal(key, 'test');
    t.equal(asyncIdentityCalls, 1);
  });

  wrapped('test', function(error, key) {
    throw new Error('let\'s ensure this doesn\'t interrupt other callbacks');
  });

  wrapped('test', function(error, key) {
    t.ok(firstCallbackCalled, 'callbacks running in order')
    t.equal(key, 'test');
    t.equal(asyncIdentityCalls, 1);
    t.end()
  });
});
