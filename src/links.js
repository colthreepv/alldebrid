angular.module('ad')
.controller('LinksController', function ($scope, $http) {
  $scope.generatingLinks = false;
  $scope.displayMode = 'textarea';
  $scope.requestedLinks = '';
  $scope.unrestrictedLinks = '';
  $scope.clickableLinks = {};

  var linkList = [];

  $scope.clearLinks = function () {
    $scope.requestedLinks = '';
    $scope.unrestrictedLinks = '';
    $scope.clickableLinks = {};
  };

  /**
   * convertLinks has no side-effects
   * 
   * @param  {Array}   links: links to convert
   * @param  {Function} callback: has no parameters
   * @param  {Function} progressFn: function notifying progress, has parameters:
   *                                @param {Object} single link output (from AD service)
   */
  function convertLinks (links, callback, progressFn) {
    if (!links.length) return callback();

    if (progressFn === undefined) {
      progressFn = angular.noop;
    }

    var firstLink = links[0];
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/service.php',
      params: {
        link: firstLink,
        json: true
      }
    }).success(function (data, status, headers, config) {
      /**
       * On success the fn removes a link from the links Array, and pushes
       * it on the partials Array.
       *
       * The callback gets called with the partials Array, when all are done.
       */

      links.splice(0, 1);
      progressFn(data);

      if (!!links.length) { // in case there are more links, re-do
        convertLinks(links, callback, progressFn);
      } else { // if they are ended
        callback();
      }
    }).error(function (data, status, headers, config) {
      $timeout(convertLinks.bind(null, links, callback, progressFn), 5000);
    });
  }

  function convertLinksP (links) {
    var convertDone = $q.defer();
    convertLinks(links, convertDone.resolve, convertDone.notify);
    return convertDone.promise;
  }

  $scope.$parent.$on('torrentLinks', function (event, args) {
    event.stopPropagation(); // stop spreading the event, it won't reach $rootScope

    $scope.clearLinks();
    angular.forEach(args, function (value, key) {
      $scope.requestedLinks += 'Torrent: ' + key + '\n';
      value.forEach(function (link) {
        $scope.requestedLinks += link + '\n';
      });
      $scope.requestedLinks += '\n';
    });

    $scope.generatingLinks = true;
    unrollHash(args, function () {
      $scope.generatingLinks = false;
    });
  });

  /**
   * unrollHash is a side-effect function that writes to:
   * * $scope.clickableLinks
   * * $scope.unrestrictedLinks
   * 
   * @param  {Object}   hash     is an objHash like: { 'torrent-name': ['link1', 'link2'] }
   * @param  {Function} callback has no parameters
   */
  function unrollHash (hash, callback) {
    var hashKeys;
    if (hashKeys = Object.keys(hash), !hashKeys.length) { // hash has been unrolled
      callback();
    } else { // in case the Hash has at least 1 (k,v)
      // hash[hashKeys[0]] is an array of links
      // hashKeys[0] is the name of the first Torrent

      var errors = [];
      $scope.clickableLinks[hashKeys[0]] = [];
      convertLinks(hash[hashKeys[0]], function done() {
        // error printing at the bottom
        if (!!errors.length) $scope.unrestrictedLinks += '\n\n === LINKS WITH ERRORS ===\n';
        errors.forEach(function (brokenLink) {
          $scope.unrestrictedLinks += brokenLink.link + ': ' + brokenLink.error + '\n';
        });

        // now the first key is done, need to roll the others
        delete hash[hashKeys[0]];
        unrollHash(hash, callback);
      }, function progress (objData) {
        // object version
        $scope.clickableLinks[hashKeys[0]].push(objData);

        // textual version
        if (objData.error) return errors.push(objData);
        $scope.unrestrictedLinks += objData.link + '\n';
      });
    }
  }

  $scope.unrestrictLinks = function () {
    linkList = $scope.requestedLinks.split('\n').filter(function (m, idx) {
      return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(m);
    });

    if (!!linkList.length) {
      $scope.unrestrictedLinks = '';
      $scope.clickableLinks = {};
      $scope.generatingLinks = true;

      var errors = [];
      $scope.clickableLinks.Unrestricted = [];
      convertLinks(linkList, function done() {
       // error printing at the bottom
        if (!!errors.length) $scope.unrestrictedLinks += '\n\n === LINKS WITH ERRORS ===\n';
        errors.forEach(function (brokenLink) {
          $scope.unrestrictedLinks += brokenLink.link + ': ' + brokenLink.error + '\n';
        });

        $scope.generatingLinks = false;
      }, function progress (objData) {
        // object version
        $scope.clickableLinks.Unrestricted.push(objData);

        // textual version
        if (objData.error) return errors.push(objData);
        $scope.unrestrictedLinks += objData.link + '\n';
      });
    }
  };

});