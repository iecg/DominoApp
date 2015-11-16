angular.module('app.players', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('players', {
    url: '/players',
    templateUrl: 'app/players/players.html',
    controller: 'PlayersCtrl'
  });
})

.controller('PlayersCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
  $timeout(function () {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
    $scope.players.newPlayer = null;
  }, 300);
  $scope.showAddPlayerPopup = function () {
    var myPopup = $ionicPopup.show({
      title: 'Add Player',
      templateUrl: 'app/players/add_new_player.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: '<b>Add</b>',
          type: 'button-dark',
          onTap: function (e) {
            if ($scope.players.newPlayer === null) {
              e.preventDefault();
            } else {
              $scope.addNewPlayer();
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      $scope.players.newPlayer = null;
    });
  };
  $scope.addNewPlayer = function () {
    var player = {
      name: null,
      wins: 0,
      losses: 0
    };
    player.name = $scope.players.newPlayer;
    $scope.players.push(player);
    $scope.players.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    $window.localStorage.players = JSON.stringify($scope.players);
  };
  $scope.showEditPlayerPopup = function (index) {
    $scope.players.newPlayer = $scope.players[index].name;
    var myPopup = $ionicPopup.show({
      title: 'Edit Player',
      templateUrl: 'app/players/add_new_player.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: '<b>Edit</b>',
          type: 'button-dark',
          onTap: function (e) {
            if ($scope.players.newPlayer === null) {
              e.preventDefault();
            } else {
              $scope.renamePlayer(index);
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      $scope.players.newPlayer = null;
    });
  };
  $scope.renamePlayer = function (index) {
    $scope.players[index].name = $scope.players.newPlayer;
    $scope.players.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    $window.localStorage.players = JSON.stringify($scope.players);
  };
  $scope.removePlayer = function (playerId) {
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
            $scope.players.splice(playerId, 1);
            $window.localStorage.players = JSON.stringify($scope.players);
          }
        }
      ]
    });
  };
}]);
