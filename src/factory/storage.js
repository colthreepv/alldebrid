'use strict';

module.exports = ['$q', function ($q) {
  return {
    set: function (name, value) {
      if (angular.isString(value)) return localStorage.setItem(name, value);
      if (angular.isObject(value)) {
        return localStorage.setItem(name, angular.toJson(value));
      }
    },
    get: function (name, type) {
      if (type === 'string') return localStorage.getItem(name);
      return angular.fromJson(localStorage.getItem(name));
    }
  };
}];
