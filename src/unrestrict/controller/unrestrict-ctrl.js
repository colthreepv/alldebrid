exports = module.exports = function ($params, $q, api) {
  var self = this;
  this.working = false;
  this.textMode = false;
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  function convertLinks (links, progressFn) {
    if (!links.length) return $q.resolve();
    if (progressFn === undefined) progressFn = angular.noop;

    return api.convert(links.pop())
    .then(progressFn)
    .then(convertLinks.bind(null, links, progressFn));
  }

  // each link getting unrestricted pass by this handler function, showing progress to user
  function progressHandler (linkResponse) {
    self.unrestricted.push(linkResponse.data);
  }

  function unrestrict (links) {
    self.working = true;
    convertLinks(angular.copy(links), progressHandler)
    .then(function () {
      self.working = false;
    });
  }

  unrestrict($params.links);
};

exports.$inject = ['$stateParams', '$q', 'adApi'];
