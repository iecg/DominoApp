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
    $scope.players.unshift({});
    $scope.game = {teams:[{members:[{},{}],scores:[]},{members:[{},{}],scores:[]}],maxscore:200};
    $scope.game.teams[0].members[0] = $scope.players[0];
    $scope.game.teams[0].members[1] = $scope.players[0];
    $scope.game.teams[1].members[0] = $scope.players[0];
    $scope.game.teams[1].members[1] = $scope.players[0];
  }, 300);
  
  $scope.newGame = function () {
    $state.go('game');
    $window.localStorage.game = JSON.stringify($scope.game);
  };
}])

.filter('excludeSelectedPlayers', function(){
  return function(players, teams, teamId, memberId){
    if(!players || !players.length){
      return;
    }
    function comparePlayers(player_){
      return function(player){
        if(player.full_name !== player_.full_name){
          return true;
        }
      };
    }
    for(var n = 0; n < 2; n++){
      for(var m = 0; m < 2; m++){
        if(teamId !== n || memberId !== m){
          players = players.filter(comparePlayers(teams[n].members[m]));
        }
      }
    }
    return players;
  };
});
