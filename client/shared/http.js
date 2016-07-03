// generic $http wrapper with automatic retry
// TODO? change this to provider so configuration can be overridden via .config
/* @ngInject */
function httpFactory ($http, $q, $timeout) {
  const retryForever = false;
  const retryTimeout = 5000;

  let ajaxStatus = false;
  /**
   * http is a function to substitute to normal $http call
   * @return {Promise} -> $http response
   */
  function http () {
    const args = arguments;
    const httpPromise = $http.apply(null, args);
    notifyAjax(true); // asd

    return httpPromise.then(function (response) {
      notifyAjax(false);
      return response;
    // in case there is an error
    }).catch(function (error) {
      // re-throw in case is not an http-error or if retry is disabled
      if (!retryForever || error.status < 500) return $q.reject(error);
      // applies to timeout extended parameters: https://docs.angularjs.org/api/ng/service/$timeout
      // the 3 $timeout parameters gets concatenated with original http arguments, using slice as
      // `arguments`  it's not a real Array
      return $timeout.apply(null, [http, retryTimeout, false].concat(Array.prototype.slice.call(args)));
    });
  }
  http.onAjax = onAjax;

  // pub/sub to broadcast AJAX events through all application
  const ajaxListeners = [];

  function notifyAjax (newValue) {
    ajaxStatus = newValue;
    ajaxListeners.forEach(cb => cb(newValue));
  }

  function onAjax (cb) {
    ajaxListeners.push(cb); // add the listener to the queue
    cb(ajaxStatus); // propagate actual status;
  }

  return http;
}

export default httpFactory;
