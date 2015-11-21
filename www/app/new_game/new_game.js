angular.module('newGame', [])

.controller('NewGameCtrl', ['$scope', '$state', 'Players', 'Game', function ($scope, $state, Players, Game) {
  $scope.players = Players.all();
  $scope.players.unshift(Players.new());
  $scope.game = Game.new();
  $scope.game.teams[0].members[0] = $scope.players[0];
  $scope.game.teams[0].members[1] = $scope.players[0];
  $scope.game.teams[1].members[0] = $scope.players[0];
  $scope.game.teams[1].members[1] = $scope.players[0];

  $scope.newGame = function () {
    $state.go('game');
    Game.save($scope.game);
  };
}]);
