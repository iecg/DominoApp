angular.module('app.match_history', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('match_history', {
    url: '/match_history',
    templateUrl: 'app/match_history/match_history.html',
    controller: 'MatchHistoryCtrl'
  });
})

.controller('MatchHistoryCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
  $timeout(function () {
    $scope.history = JSON.parse($window.localStorage.history);
  }, 300);
  $scope.clearMatchHistory = function () {
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
