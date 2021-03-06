exports = module.exports = function ($params, $q, $window, api, storage) {
  var self = this;
  this.working = false;
  this.linksDisplay = storage.get('links-display') === 'text' ? true : false;
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  this.done = function () {
    $window.history.back();
  };

  this.textMode = textMode;

  function textMode (value) {
    if (value === undefined) return self.linksDisplay;
    self.linksDisplay = !self.linksDisplay;
    storage.set('links-display', self.linksDisplay ? 'text' : 'link');
  }

  function toSecure (unrestrictData) {
    if (unrestrictData && unrestrictData.link) unrestrictData.link = unrestrictData.link.replace('http:', 'https:');
    return unrestrictData;
  }

  // each link getting unrestricted pass by this handler function, showing progress to user
  function progressHandler (linkResponse) {
    self.unrestricted.push(toSecure(linkResponse.data));
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
