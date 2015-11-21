angular.module('menu', [])

.controller('MenuCtrl', ['$scope', '$state', '$ionicPopup', '$window', '$ionicHistory', 'Game', function ($scope, $state, $ionicPopup, $window, $ionicHistory, Game) {
  $scope.continueGame = function () {
    if (angular.equals({}, JSON.parse($window.localStorage.Game || '{}'))) {
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
    var game = Game.new();
    Game.save(game);
    $state.go('game');
  };
}]);
