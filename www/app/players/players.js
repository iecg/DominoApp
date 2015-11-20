angular.module('players', [])

.controller('PlayersCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', 'Players', function ($scope, $window, $timeout, $ionicPopup, Players) {
  $scope.players = Players.all(); 
  console.log(JSON.stringify($scope.players));

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
              callback();
            }
          }
        }
      ]
    });
  };

  $scope.showAddPlayerPopup = function () {
    $scope.player = Players.new();
    myPopup('Add Player', '<b>Add</b>', function () {
      $scope.player = Players.create($scope.player.firstName, $scope.player.lastName);
      $scope.players.push($scope.player);
    });
  };
 
  $scope.showEditPlayerPopup = function (index) {
    $scope.player = $scope.players[index];
    myPopup('Edit Player', '<b>Edit</b>', function (index) {
      $scope.players[index] = $scope.player;
      // Players.update($scope.player);
    });
  };

  $scope.deletePlayer = function (index) {
    Players.delete($scope.players[index]);
    $scope.players.splice(index, 1);
  };
}]);
