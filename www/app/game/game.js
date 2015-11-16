angular.module('app.game', [])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('game', {
    url: '/game',
    templateUrl: 'app/game/game.html',
    controller: 'GameCtrl'
  })
})

.controller('GameCtrl', ['$scope', '$ionicModal', '$ionicPopup', '$state', '$window', '$ionicHistory', '$timeout', function ($scope, $ionicModal, $ionicPopup, $state, $window, $ionicHistory, $timeout) {
  $timeout(function () {
    $scope.game = JSON.parse($window.localStorage.game);
    $scope.game.newScore = null;
    $scope.players = JSON.parse($window.localStorage.players);
    $scope.matches = JSON.parse($window.localStorage.matches || '[]');
  }, 300);

  $ionicModal.fromTemplateUrl('app/game/edit_score.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.editScoreModal = modal;
  });

  $scope.totalScore = function (scoreArray) {
    var totalScore = 0;
    for (var i = 0; i < scoreArray.length; i++) {
      totalScore += scoreArray[i];
    }
    return totalScore;
  };

  $scope.showEditScoreModal = function (teamId) {
    $scope.teamId = teamId;
    $scope.editScoreModal.show();
  };

  $scope.showEditScorePopup = function (scoreId) {
    var myPopup = $ionicPopup.show({
      title: 'Edit Score',
      templateUrl: 'app/game/add_new_score.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: '<b>Edit</b>',
          type: 'button-dark',
          onTap: function (e) {
            if (!angular.isNumber($scope.game.newScore) || $scope.game.newScore <= 0) {
              e.preventDefault();
            } else {
              $scope.editScore(scoreId);
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      $scope.game.newScore = null;
    });
  };

  $scope.editScore = function (scoreId) {
    $scope.game.teams[$scope.teamId].scores[scoreId] = parseInt($scope.game.newScore);
    $window.localStorage.game = JSON.stringify($scope.game);
    $scope.editScoreModal.hide();
  };

  $scope.removeScore = function (scoreId) {
    $scope.game.teams[$scope.teamId].scores.splice(scoreId, 1);
    $window.localStorage.game = JSON.stringify($scope.game);
    $scope.editScoreModal.hide();
  };

  $scope.showAddScorePopup = function (teamId) {
    $scope.teamId = teamId;
    var myPopup = $ionicPopup.show({
      title: 'Add Score',
      templateUrl: 'app/game/add_new_score.html',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel', type: 'button-outline button-dark'
        },
        {
          text: '<b>Add</b>',
          type: 'button-dark',
          onTap: function (e) {
            if (!angular.isNumber($scope.game.newScore) || $scope.game.newScore <= 0) {
              e.preventDefault();
            } else {
              $scope.addNewScore();
            }
          }
        }
      ]
    });
    myPopup.then(function (res) {
      $scope.game.newScore = null;
    });
  };

  $scope.addNewScore = function () {
    $scope.game.teams[$scope.teamId].scores.push(parseInt($scope.game.newScore));
    $window.localStorage.game = JSON.stringify($scope.game);
    if ($scope.totalScore($scope.game.teams[$scope.teamId].scores) >= $scope.game.maxscore) {
      $scope.updateMatchHistory();
      $scope.updatePlayers();
      var myPopup = $ionicPopup.show({
        title: $scope.game.teams[$scope.teamId].members[0].name + " / " + $scope.game.teams[$scope.teamId].members[1].name + ' won',
        template: '<span class="dark">Do you wish to play again?</span>',
        scope: $scope,
        buttons: [
          {
            text: 'No', 
            type: 'button-outline button-dark',
            onTap: function(e) {
              $window.localStorage.removeItem('game');
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('home');
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

  $scope.updateMatchHistory = function() {
    if($scope.game.teams[0].members[0].name === "Player 1") { return; }
    var matches = {"teams":[{"members":[],"score":""},{"members":[],"score":""}],"date":null};
    matches.date = new Date();
    if ($scope.teamId === 0) {
      matches.teams[0].members.push($scope.game.teams[0].members[0].name);
      matches.teams[0].members.push($scope.game.teams[0].members[1].name);
      matches.teams[0].score = $scope.totalScore($scope.game.teams[0].scores);
      matches.teams[1].members.push($scope.game.teams[1].members[0].name);
      matches.teams[1].members.push($scope.game.teams[1].members[1].name);
      matches.teams[1].score = $scope.totalScore($scope.game.teams[1].scores);
      $scope.game.teams[0].members[0].wins += 1;
      $scope.game.teams[0].members[1].wins += 1;
      $scope.game.teams[1].members[0].losses += 1;
      $scope.game.teams[1].members[1].losses += 1;
    }
    else {
      matches.teams[0].members.push($scope.game.teams[1].members[0].name);
      matches.teams[0].members.push($scope.game.teams[1].members[1].name);
      matches.teams[0].score = $scope.totalScore($scope.game.teams[1].scores);
      matches.teams[1].members.push($scope.game.teams[0].members[0].name);
      matches.teams[1].members.push($scope.game.teams[0].members[1].name);
      matches.teams[1].score = $scope.totalScore($scope.game.teams[0].scores);
      $scope.game.teams[0].members[0].losses += 1;
      $scope.game.teams[0].members[1].losses += 1;
      $scope.game.teams[1].members[0].wins += 1;
      $scope.game.teams[1].members[1].wins += 1;
    }
    $scope.matches.push(matches);
    $window.localStorage.matches = JSON.stringify($scope.matches);
  };

  $scope.updatePlayers = function() {
    if($scope.game.teams[0].members[0].name === "Player 1") { return; }
    $scope.updatePlayer($scope.game.teams[0].members[0]);
    $scope.updatePlayer($scope.game.teams[0].members[1]);
    $scope.updatePlayer($scope.game.teams[1].members[0]);
    $scope.updatePlayer($scope.game.teams[1].members[1]);
    $window.localStorage.players = JSON.stringify($scope.players);
  };

  $scope.updatePlayer = function(player) {
    for(var i = 0; i < $scope.players.length; i++) {
      if($scope.players[i].name == player.name) {
        $scope.players[i] = player;
        break;
      }
    }
  };
}]);
