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
  };

  /**
   * convertLinks has no side-effects
   * 
   * @param  {Array}   links: links to convert
   * @param  {Function} callback: has (unrestrictedLinks) parameters:
   *                             @param {Array} unrestrictedLinks: converted links output
   * @param  {Array}   partials: support Array, when invoking must be undefined
   */
  function convertLinks (links, callback, partials) {
    if (!links.length) return callback();

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
      if (partials === undefined) partials = []; // initialize a partial array
      partials.push(data);

      if (!!links.length) { // in case there are more links, re-do
        convertLinks(links, callback, partials);
      } else { // if they are ended
        callback(partials);
      }
    }).error(function (data, status, headers, config) {
      $timeout(convertLinks.bind(null, links, callback, partials), 5000);
    });
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
      convertLinks(hash[hashKeys[0]], function (converted) {
        // object version
        $scope.clickableLinks[hashKeys[0]] = converted;

        // textual version
        converted.forEach(function (c) {
          if (c.error) console.log('plz debug me');
          $scope.unrestrictedLinks += c.link + '\n';
        });

        // now the first key is done, need to roll the others
        delete hash[hashKeys[0]];
        unrollHash(hash, callback);
      }); 
    }
  }

  $scope.unrestrictLinks = function () {
    linkList = $scope.unrestrictLinks.split('\n').filter(function (m, idx) {
      return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(m);
    });

    if (!!linkList.length) {
      $scope.generatingLinks = true;
      convertLinks(linkList, function (converted) {
        $scope.clickableLinks.Unrestricted = converted;

        // textual version
        converted.forEach(function (c) {
          if (c.error) console.log('plz debug me');
          $scope.unrestrictedLinks += c.link + '\n';
        });

        $scope.generatingLinks = false;
      });
    }
  };

});