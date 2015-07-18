'use strict';

module.exports = function () {
  // serializes the given Object into a key-value pair string. This
  // method expects an object and will default to the toString() method.
  // --
  // NOTE: This is an altered version of the jQuery.param() method which
  // will serialize a data collection for Form posting.
  // --
  // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
  function serializeData (data) {
    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {
      return (data === null) ? '' : data.toString();
    }
    var buffer = [];
    // Serialize each key in the object.
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      var value = data[name];
      buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value));
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join('&').replace(/%20/g, '+');
    return source;
  }

  // Return the factory value.
  return function (data, getHeaders) {
    return serializeData(data);
  };
};
