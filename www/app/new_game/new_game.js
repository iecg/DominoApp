angular.module('newGame', [])

.controller('NewGameCtrl', ['$scope', '$state', '$window', '$timeout', function($scope, $state, $window, $timeout) {
  $timeout(function() {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
    $scope.players.unshift({});
    $scope.game = {teams:[{members:[{},{}],scores:[]},{members:[{},{}],scores:[]}],maxScore:200};
    $scope.game.teams[0].members[0] = $scope.players[0];
    $scope.game.teams[0].members[1] = $scope.players[0];
    $scope.game.teams[1].members[0] = $scope.players[0];
    $scope.game.teams[1].members[1] = $scope.players[0];
  }, 300);
  
  $scope.newGame = function() {
    $state.go('game');
    $window.localStorage.game = JSON.stringify($scope.game);
  };
}])
