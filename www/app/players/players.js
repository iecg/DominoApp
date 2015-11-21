angular.module('players', [])

.controller('PlayersCtrl', ['$scope', '$ionicPopup', 'Players', function ($scope, $ionicPopup, Players) {
  $scope.players = Players.all();

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
      Players.create($scope.player);
      $scope.players = Players.all();
    });
  };

  $scope.showEditPlayerPopup = function (index) {
    $scope.player = $scope.players[index];
    myPopup('Edit Player', '<b>Edit</b>', function (index) {
      Players.update($scope.player);
      $scope.players = Players.all();
    });
  };

  $scope.deletePlayer = function (index) {
    Players.delete($scope.players[index]);
    $scope.players = Players.all();
  };
}]);
