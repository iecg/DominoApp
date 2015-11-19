angular.module('game', [])

.controller('GameCtrl', ['$scope', '$ionicModal', '$ionicPopup', '$state', '$window', '$ionicHistory', '$timeout', function ($scope, $ionicModal, $ionicPopup, $state, $window, $ionicHistory, $timeout) {
  $timeout(function () {
    $scope.game = JSON.parse($window.localStorage.game);
    $scope.game.newScore = null;
    $scope.players = JSON.parse($window.localStorage.players);
    $scope.matches = JSON.parse($window.localStorage.matches || '[]');
  }, 300);

  $scope.totalScore = function (scoreArray) {
    var totalScore = 0;
    scoreArray.forEach(function (score) {
      totalScore += score;
    });
    return totalScore;
  };

  var myPopup = function (title_text, button_text, callback) {
    $ionicPopup.show({
      title: title_text,
      templateUrl: 'app/game/score_popup.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: button_text,
          type: 'button-dark',
          onTap: function (e) {
            if (!angular.isNumber($scope.game.newScore) || $scope.game.newScore <= 0) {
              e.preventDefault();
            } else {
              callback();
              $scope.game.teams[$scope.teamId].scores.push(parseInt($scope.game.newScore));
              $scope.checkWinner();
              $window.localStorage.game = JSON.stringify($scope.game);
            }
          }
        }
      ]
    }).then(function (res) {
      $scope.game.newScore = null;
    });
  };

  $scope.showAddScorePopup = function (teamId) {
    $scope.teamId = teamId;
    myPopup('Add Score', '<b>Add</b>', function () {});
  };

  $scope.showEditScorePopup = function (teamId) {
    $scope.teamId = teamId;
    $scope.game.newScore = $scope.game.teams[$scope.teamId].scores[$scope.game.teams[$scope.teamId].scores.length - 1];
    myPopup('Edit Score', '<b>Edit</b>', function () {
      $scope.game.teams[$scope.teamId].scores.pop();
    });
  };

  $scope.checkWinner = function () {
    if ($scope.totalScore($scope.game.teams[$scope.teamId].scores) >= $scope.game.maxScore) {
      $scope.updateMatchHistory();
      $scope.updatePlayers();
      var myPopup = $ionicPopup.show({
        title: $scope.game.teams[$scope.teamId].members[0].fullName + ' and ' + $scope.game.teams[$scope.teamId].members[1].fullName + ' won',
        template: '<span class="dark">Do you wish to play again?</span>',
        scope: $scope,
        buttons: [
          {
            text: 'No',
            type: 'button-outline button-dark',
            onTap: function (e) {
              $window.localStorage.removeItem('game');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('index');
            }
          },
          {
            text: '<b>Yes</b>',
            type: 'button-dark',
            onTap: function (e) {
              $scope.game.teams[0].scores = [];
              $scope.game.teams[1].scores = [];
            }
          }
        ]
      });
    }
  };

  $scope.updateMatchHistory = function () {
    if ($scope.game.teams[0].members[0].fullName === 'Player 1') { return; }
    var matches = JSON.parse('./match.json');
    matches.date = new Date();
    if ($scope.teamId === 0) {
      matches.teams[0].members.push($scope.game.teams[0].members[0].fullName);
      matches.teams[0].members.push($scope.game.teams[0].members[1].fullName);
      matches.teams[0].score = $scope.totalScore($scope.game.teams[0].scores);
      matches.teams[1].members.push($scope.game.teams[1].members[0].fullName);
      matches.teams[1].members.push($scope.game.teams[1].members[1].fullName);
      matches.teams[1].score = $scope.totalScore($scope.game.teams[1].scores);
      $scope.game.teams[0].members[0].wins += 1;
      $scope.game.teams[0].members[1].wins += 1;
      $scope.game.teams[1].members[0].losses += 1;
      $scope.game.teams[1].members[1].losses += 1;
    } else {
      matches.teams[0].members.push($scope.game.teams[1].members[0].fullName);
      matches.teams[0].members.push($scope.game.teams[1].members[1].fullName);
      matches.teams[0].score = $scope.totalScore($scope.game.teams[1].scores);
      matches.teams[1].members.push($scope.game.teams[0].members[0].fullName);
      matches.teams[1].members.push($scope.game.teams[0].members[1].fullName);
      matches.teams[1].score = $scope.totalScore($scope.game.teams[0].scores);
      $scope.game.teams[0].members[0].losses += 1;
      $scope.game.teams[0].members[1].losses += 1;
      $scope.game.teams[1].members[0].wins += 1;
      $scope.game.teams[1].members[1].wins += 1;
    }
    $scope.matches.push(matches);
    $window.localStorage.matches = JSON.stringify($scope.matches);
  };

  $scope.updatePlayers = function () {
    $scope.updatePlayer($scope.game.teams[0].members[0]);
    $scope.updatePlayer($scope.game.teams[0].members[1]);
    $scope.updatePlayer($scope.game.teams[1].members[0]);
    $scope.updatePlayer($scope.game.teams[1].members[1]);
    $window.localStorage.players = JSON.stringify($scope.players);
  };

  $scope.updatePlayer = function (player) {
    var index = $scope.players.findIndex(function (player) {
      return player.fullName === this.fullName;
    }, player);
    $scope.players[index] = player;
  };
}]);
