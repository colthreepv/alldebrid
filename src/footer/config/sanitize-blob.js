exports = module.exports = function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
};
exports.$inject = ['$compileProvider'];
