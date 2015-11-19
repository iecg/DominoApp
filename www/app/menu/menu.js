angular.module('menu', [])

.controller('MenuCtrl', ['$scope', '$state', '$ionicPopup', '$window', '$ionicHistory', function ($scope, $state, $ionicPopup, $window, $ionicHistory) {
  $scope.continueGame = function () {
    if (angular.equals({}, JSON.parse($window.localStorage.game || '{}'))) {
      $ionicPopup.alert({
        title: 'There is no saved game',
        buttons: [{text: 'OK', type: 'button-dark'}]
      });
    }
    else {
      $state.go('game');
    }
  };

  $scope.quickGame = function () {
    $scope.game = JSON.parse('./game.json');
    $window.localStorage.game = JSON.stringify($scope.game);
    $state.go('game');
  };
}]);
