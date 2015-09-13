exports = module.exports = function ($params, $q, $window, api) {
  var self = this;
  this.working = false;
  this.textMode = false;
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  // each link getting unrestricted pass by this handler function, showing progress to user
  function progressHandler (linkResponse) {
    self.unrestricted.push(linkResponse.data);
    self.unrestrictedText = self.unrestricted.reduce(function (text, file) {
      if (file.error !== '') return text += 'ERROR: ' + file.error;
      return text += file.link + '\n';
    }, '');
  }

  function convertLinks (links) {
    if (!links.length) return $q.resolve();

    return api.convert(links.pop())
    .then(progressHandler)
    .then(convertLinks.bind(null, links));
  }

  function unrestrict (links) {
    self.working = true;
    convertLinks(angular.copy(links), progressHandler)
    .then(function () {
      self.working = false;
    });
  }

  this.done = function () {
    $window.history.back();
  };

  if ($params.links) unrestrict($params.links);
};

exports.$inject = ['$stateParams', '$q', '$window', 'adApi'];
