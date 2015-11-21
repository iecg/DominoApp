angular.module('game', [])

.controller('GameCtrl', ['$scope', '$ionicPopup', '$state', '$ionicHistory', 'Game', function ($scope, $ionicPopup, $state, $ionicHistory, Game) {
  $scope.game = Game.load();

  var gameOverPopup = function (popupTitle, popupMessage) {
    $ionicPopup.show({
      title: popupTitle,
      template: popupMessage,
      scope: $scope,
      buttons: [
        {
          text: 'No',
          type: 'button-outline button-dark',
          onTap: function (e) {
            Game.delete();
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('menu');
          }
        },
        {
          text: '<b>Yes</b>',
          type: 'button-dark',
          onTap: function (e) {
            Game.reset($scope.game);
          }
        }
      ]
    })
  };

  var checkWinner = function () {
    var winner = Game.checkWinner();
    if(winner === -1) {
      return;
    }
    var popupTitle;
    if ($scope.game.teams[0].members[0].id !== 0) {
      popupTitle = $scope.game.teams[winner].name() + ' have won';
    } else {
      popupTitle = 'Team ' + (winner + 1) + ' has won';
    }
    var popupMessage = '<span class="dark">Do you wish to play again?</span>';
    gameOverPopup(popupTitle, popupMessage);
  }

  var scorePopup = function (popupTitle, buttonText, callback) {
    $ionicPopup.show({
      title: popupTitle,
      templateUrl: 'app/game/score_popup.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: buttonText,
          type: 'button-dark',
          onTap: function (e) {
            if (!angular.isNumber($scope.game.score) || $scope.game.score <= 0) {
              e.preventDefault();
            } else {
              callback();
            }
          }
        }
      ]
    }).then(function (res) {
      $scope.game.score = null;
      $scope.game = Game.load();
      checkWinner();
    });
  };

  $scope.showAddScorePopup = function (teamId) {
    scorePopup('Add Score', '<b>Add</b>', function () {
      Game.addScore(teamId, $scope.game.score);
    });
  };

  $scope.showEditScorePopup = function (teamId) {
    scorePopup('Edit Score', '<b>Edit</b>', function () {
      Game.editScore(teamId, $scope.game.score);
    });
  };
}]);
