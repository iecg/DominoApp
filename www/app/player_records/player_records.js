angular.module('app.player_records', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('player_records', {
    url: '/player_records',
    templateUrl: 'app/player_records/player_records.html',
    controller: 'PlayerRecordsCtrl'
  });
})

.controller('PlayerRecordsCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
  $timeout(function () {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
  }, 300);
  $scope.clearPlayerRecords = function() {
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
            for(var i = 0; i < $scope.players.length; i++) {
              $scope.players[i].wins = 0;
              $scope.players[i].losses = 0;
            }
            $window.localStorage.players = JSON.stringify($scope.players);
          }
        }
      ]
    });
  };
}]);
