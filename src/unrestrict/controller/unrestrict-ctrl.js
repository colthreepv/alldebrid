exports = module.exports = function ($params, $q, $window, api, storage) {
  var self = this;
  this.working = false;
  this.textMode = storage.get('links-display') === 'text' ? true : false;
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  this.done = function () {
    $window.history.back();
  };

  this.swapDisplayMode = swapDisplayMode;

  function swapDisplayMode () {
    self.textMode = !self.textMode;
    storage.set('links-display', self.textMode ? 'text' : 'link');
  }

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

  if ($params.links) unrestrict($params.links);
};

exports.$inject = ['$stateParams', '$q', '$window', 'adApi', 'storage'];
