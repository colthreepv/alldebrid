var api = {
  register: '/ad/register/'
};
var retryForever = true;
var retryTimeout = 5000;

exports = module.exports = function ($http, $q, $timeout) {

  function httpAndRetry () {
    var args = arguments;
    var httpPromise = $http.apply(null, args);

    // in case there is an error
    httpPromise.error(function () {
      if (!retryForever) return $q.resolve(arguments); // FIXME?
      return $timeout(function () {
        return httpAndRetry.apply(null, args);
      }, retryTimeout);
    });

    return httpPromise;
  }

  this.checkLogin = function () {
    return new $q(function (resolve) {
      $http({
        method: 'GET',
        url: api.register,
        responseType: 'document'
      }).success(function (page) {
        resolve(page);
      });
    });
  };

  this.httpAndRetry = httpAndRetry;

};
exports.$inject = ['$http', '$q', '$timeout'];
