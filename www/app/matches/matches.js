angular.module('matches', [])

.controller('MatchesCtrl', ['$scope', '$ionicPopup', 'Matches', function ($scope, $ionicPopup, Matches) {
  $scope.matches = Matches.all();

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
          }
        }
      ]
    });
  };
}]);
