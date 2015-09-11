'use strict';

exports = module.exports = function () {
  this.set = function (name, value) {
    if (angular.isString(value)) return localStorage.setItem(name, value);
    if (angular.isObject(value)) {
      return localStorage.setItem(name, angular.toJson(value));
    }
  };
  this.get = function (name, type) {
    if (type === 'string') return localStorage.getItem(name);
    return angular.fromJson(localStorage.getItem(name));
  };
};
