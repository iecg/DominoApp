angular.module('app.players', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('players', {
    url: '/players',
    templateUrl: 'app/players/players.html',
    controller: 'PlayersCtrl'
  });
})

.controller('PlayersCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function($scope, $window, $timeout, $ionicPopup) {
  $timeout(function() {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
  }, 300);
  
  var myPopup = function(title_text, button_text, callback) {
    $ionicPopup.show({
      title: title_text,
      templateUrl: 'app/players/player_popup.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: button_text,
          type: 'button-dark',
          onTap: function(e) {
            if($scope.player === null) {
              e.preventDefault();
            } else {
              $scope.player.full_name = $scope.player.first_name + " " + $scope.player.last_name;
              callback();
              // $scope.players.sort(function(a, b) {
              //   return a.name.localeCompare(b.name);
              // });
              $window.localStorage.players = JSON.stringify($scope.players);
            }
          }
        }
      ]
    });
  };

  $scope.showAddPlayerPopup = function() {
    $scope.player = {
      first_name: '',
      last_name: '',
      wins: 0,
      losses: 0
    };
    myPopup('Add Player', '<b>Add</b>', function() {
      $scope.players.push($scope.player);
    });
  };
  
  $scope.showEditPlayerPopup = function(index) {
    $scope.player = $scope.players[index];
    myPopup('Edit Player', '<b>Edit</b>', function(index) {
      $scope.players[index] = $scope.player;
    });
  };

  $scope.removePlayer = function(playerId) {
    $scope.players.splice(playerId, 1);
    $window.localStorage.players = JSON.stringify($scope.players);
  };
}]);
