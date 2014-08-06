angular.module('ad')
.controller('LinksController', function ($scope) {
  $scope.displayMode = 'textarea';
  $scope.checkedTorrents = $scope.$parent.checkedTorrents;

  $scope.clearLinks = function () {
    $scope.$parent.linksText = '';
  };

});