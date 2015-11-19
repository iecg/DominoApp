angular.module('players', [])

.controller('PlayersCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
  $timeout(function () {
    $scope.players = JSON.parse($window.localStorage.players || '[]');
  }, 300);

  var myPopup = function (popupTitle, buttonText, callback) {
    $ionicPopup.show({
      title: popupTitle,
      templateUrl: 'app/players/player_popup.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: buttonText,
          type: 'button-dark',
          onTap: function (e) {
            if ($scope.player === null) {
              e.preventDefault();
            } else {
              $scope.player.fullName = $scope.player.firstName + ' ' + $scope.player.lastName;
              callback();
              // $scope.players.sort(function (a, b) {
              //   return a.name.localeCompare(b.name);
              // });
              $window.localStorage.players = JSON.stringify($scope.players);
            }
          }
        }
      ]
    });
  };

  $scope.showAddPlayerPopup = function () {
    $scope.player = JSON.parse('./player.json');
    myPopup('Add Player', '<b>Add</b>', function () {
      $scope.players.push($scope.player);
    });
  };
 
  $scope.showEditPlayerPopup = function (index) {
    $scope.player = $scope.players[index];
    myPopup('Edit Player', '<b>Edit</b>', function (index) {
      $scope.players[index] = $scope.player;
    });
  };

  $scope.deletePlayer = function (playerId) {
    $scope.players.splice(playerId, 1);
    $window.localStorage.players = JSON.stringify($scope.players);
  };
}]);
