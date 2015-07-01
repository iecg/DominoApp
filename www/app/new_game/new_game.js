angular.module('app.new_game', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('new_game', {
    url: '/new_game',
    templateUrl: 'app/new_game/new_game.html',
    controller: 'NewGameCtrl'
  });
})

.controller('NewGameCtrl', ['$scope', '$state', '$window', '$timeout', function ($scope, $state, $window, $timeout) {
  $timeout(function () {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
    for(var i = 1; i < 5; i++) {
      var player = {
        name: null,
        wins: 0,
        losses: 0
      };
      player.name = "Player " + i;
      $scope.players.push(player);
    }
    $scope.game = {"teams":[{"members":[{},{}],"scores":[]},{"members":[{},{}],"scores":[]}],"maxscore":"200"};
    $scope.game.teams[0].members[0] = $scope.players[$scope.players.length - 4];
    $scope.game.teams[0].members[1] = $scope.players[$scope.players.length - 3];
    $scope.game.teams[1].members[0] = $scope.players[$scope.players.length - 2];
    $scope.game.teams[1].members[1] = $scope.players[$scope.players.length - 1];
  }, 300);
  $scope.newGame = function () {
    $state.go('game');
    $window.localStorage.game = JSON.stringify($scope.game);
  };
  $scope.getTeam = function (teamId) {
    if (teamId) {
      return 'B';
    }
    else {
      return 'A';
    }
  };
}]);
