angular.module('matches', [])

.controller('MatchesCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
  $timeout(function () {
    $scope.matches = JSON.parse($window.localStorage.matches);
  }, 300);

  $scope.clearMatches = function () {
    $ionicPopup.confirm({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: '<b>Yes</b>',
          type: 'button-dark',
          onTap: function (e) {
            $window.localStorage.history = JSON.stringify([]);
            $scope.history = [];
          }
        }
      ]
    });
  };
}]);
