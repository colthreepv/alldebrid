import angular from 'angular';

/* @ngInject */
function storage () {
  return {
    set: function (name, value) {
      if (angular.isString(value)) return localStorage.setItem(name, value);
      if (angular.isObject(value)) {
        return localStorage.setItem(name, angular.toJson(value));
      }
    },
    get: function (name, isJSON) {
      if (isJSON) return angular.fromJson(localStorage.getItem(name));
      return localStorage.getItem(name);
    }
  };
}
export default storage;
