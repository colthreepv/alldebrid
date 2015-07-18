'use strict';

module.exports = ['$q', function ($q) {
  return {
    set: function (name, value) {
      var setDone = $q.defer();
      var setObj = {};
      if (angular.isObject(value)) {
        setObj[name] = angular.toJson(value);
        chrome.storage.sync.set(setObj, function () {
          setDone.resolve();
        });
      }
      if (angular.isString(value)) {
        setObj[name] = value;
        chrome.storage.sync.set(setObj, function () {
          setDone.resolve();
        });
      }

      return setDone.promise;
    },
    get: function (name, type) {
      var getDone = $q.defer();
      if (type === 'object') {
        chrome.storage.sync.get(name, function (items) {
          if (angular.isUndefined(items[name])) {
            getDone.reject();
          } else {
            getDone.resolve(angular.fromJson(items[name]));
          }
        });
      }
      if (type === 'string') {
        chrome.storage.sync.get(name, function (items) {
          if (angular.isUndefined(items[name])) {
            getDone.reject();
          } else {
            getDone.resolve(items[name]);
          }
        });
      }

      return getDone.promise;
    }
  };
}];
