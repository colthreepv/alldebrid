// generic $http wrapper with automatic retry
function http ($http, $q, $timeout) {
  var retryForever = true;
  var retryTimeout = 5000;

  var ajaxDelayNotify = 500; // ms

  var ajaxStatus = false;
  /**
   * http is a function to substitute to normal $http call
   * @return {Promise} -> $http response
   */
  function http () {
    var args = arguments;
    var httpPromise = $http.apply(null, args);
    sendAjax(true); // asd

    return httpPromise.then(function (response) {
      sendAjax(false);
      return response;
    // in case there is an error
    }).catch(function (error) {
      // re-throw in case is not an http-error or if retry is disabled
      if (!error || !error.config || !retryForever) throw new Error(error);
      // applies to timeout extended parameters: https://docs.angularjs.org/api/ng/service/$timeout
      // the 3 $timeout parameters gets concatenated with original http arguments, using slice as
      // `arguments`  it's not a real Array
      return $timeout.apply(null, [http, retryTimeout, false].concat(Array.prototype.slice.call(args)));
    });
  }

  /**
   * Suppose 350ms of ajaxDelayNotify
   *
   * Time 0: HTTP request starts
   * Time 600: HTTP request completes
   * Time 600: $timeout planned for Time 950 sends 'completed'
   * Time 750: HTTP request starts - $timeout must be canceled
   * Time 800: HTTP request completes, new $timeout planned for Time 1150, sends 'completed'
   * Time 1150: finally frontend receives the 'complete' status
   */

  // pub/sub to broadcast AJAX events through all application
  var ajaxListeners = [];
  var ajaxTimeout, isCanceled;
  function sendAjax (newValue) {
    isCanceled = $timeout.cancel(ajaxTimeout); // cancel the scheduled $timeout
    if (isCanceled === true) { // means the user was getting a notification after 350ms saying 'completed', but instead a new HTTP occurred
      if (newValue === false) ajaxTimeout = $timeout(notifyAjax.bind(null, newValue), ajaxDelayNotify);
      // if the new value is 'true', don't do anything, let the user wait for the 'false' notification
    } else {
      if (newValue === false) ajaxTimeout = $timeout(notifyAjax.bind(null, newValue), ajaxDelayNotify);
      else notifyAjax(newValue);
    }
  }
  function notifyAjax (newValue) {
    ajaxStatus = newValue;
    ajaxListeners.forEach(function (cb) {
      cb(newValue);
    });
  }

  http.onAjax = function (cb) {
    ajaxListeners.push(cb); // add the listener to the queue
    cb(ajaxStatus); // propagate actual status;
  };

  return http;
}
http.$inject = ['$http', '$q', '$timeout'];

export default http;
