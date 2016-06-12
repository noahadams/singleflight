'use strict';

var Singleflight = function(wrapped) {
  this._wrapped = wrapped;
  this._callbacks = {};
}

Singleflight.prototype.finish = function(key, args) {
  var callbacks = this._callbacks[key];
  delete this._callbacks[key];

  for (var i = 0, len = callbacks.length; i < len; i++) {
    try {
      callbacks[i].apply(null, args);
    } catch (e) {
      console.error(e);
    }
  }
}

Singleflight.prototype.start = function(key, callback) {
  var callbacks = this._callbacks[key];
  if (callbacks) {
    callbacks.push(callback);
    return;
  }

  this._callbacks[key] = [callback];
  var self = this;
  this._wrapped(key, function() {
    self.finish(key, arguments);
  });
}

var singleflight = function(wrapped) {
  var state = new Singleflight(wrapped);
  var wrapper = function(key, callback) {
    state.start(key, callback);
  }
  return wrapper;
}

singleflight._Singleflight = Singleflight;

module.exports = singleflight;
