angular.module('DominoApp.controllers', [])

    .controller('HomeCtrl', ['$scope', '$state', '$ionicPopup', '$window', '$ionicHistory', function ($scope, $state, $ionicPopup, $window, $ionicHistory) {
        $scope.continueGame = function () {
            if (angular.equals({}, JSON.parse($window.localStorage['game'] || '{}'))) {
                $ionicPopup.alert({
                    title: 'There is no saved game',
                    buttons: [{text: 'OK', type: 'button-dark'}]
                })
            }
            else {
                $state.go('game')
            }
        }
    }])

    .controller('NewGameCtrl', ['$scope', '$state', '$window', '$timeout', function ($scope, $state, $window, $timeout) {
        $timeout(function () {
            $scope.players = JSON.parse($window.localStorage['players'] || '[]');
            for(var i = 1; i < 5; i++) {
                var player = {
                    name: null,
                    wins: 0,
                    losses: 0
                };
                player.name = "Player " + i;
                $scope.players.push(player)
            }
            $scope.game = {"teams":[{"members":[{},{}],"scores":[]},{"members":[{},{}],"scores":[]}],"maxscore":"200"};
            $scope.game.teams[0].members[0] = $scope.players[$scope.players.length - 4];
            $scope.game.teams[0].members[1] = $scope.players[$scope.players.length - 3];
            $scope.game.teams[1].members[0] = $scope.players[$scope.players.length - 2];
            $scope.game.teams[1].members[1] = $scope.players[$scope.players.length - 1];
        }, 300);
        $scope.newGame = function () {
            $state.go('game');
            $window.localStorage['game'] = JSON.stringify($scope.game)
        };
        $scope.getTeam = function (teamId) {
            if (teamId) {
                return 'B'
            }
            else {
                return 'A'
            }
        }
    }])

    .controller('GameCtrl', ['$scope', '$ionicModal', '$ionicPopup', '$state', '$window', '$ionicHistory', '$timeout', function ($scope, $ionicModal, $ionicPopup, $state, $window, $ionicHistory, $timeout) {
        $timeout(function () {
            $scope.game = JSON.parse($window.localStorage['game']);
            $scope.game.newScore = null
            $scope.players = JSON.parse($window.localStorage['players']);
            $scope.history = JSON.parse($window.localStorage['history'] || '[]');
        }, 300);

        $ionicModal.fromTemplateUrl('templates/edit_score.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.editScoreModal = modal
        });

        $scope.totalScore = function (scoreArray) {
            var totalScore = 0;
            for (var i = 0; i < scoreArray.length; i++) {
                totalScore += scoreArray[i]
            }
            return totalScore
        };

        $scope.showEditScoreModal = function (teamId) {
            $scope.teamId = teamId;
            $scope.editScoreModal.show()
        };

        $scope.showEditScorePopup = function (scoreId) {
            var myPopup = $ionicPopup.show({
                title: 'Edit Score',
                templateUrl: 'templates/add_new_score.html',
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
                                e.preventDefault()
                            } else {
                                $scope.editScore(scoreId)
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.game.newScore = null
            })
        };

        $scope.editScore = function (scoreId) {
            $scope.game.teams[$scope.teamId].scores[scoreId] = parseInt($scope.game.newScore);
            $window.localStorage['game'] = JSON.stringify($scope.game);
            $scope.editScoreModal.hide()
        };

        $scope.removeScore = function (scoreId) {
            $scope.game.teams[$scope.teamId].scores.splice(scoreId, 1);
            $window.localStorage['game'] = JSON.stringify($scope.game);
            $scope.editScoreModal.hide()
        };

        $scope.showAddScorePopup = function (teamId) {
            $scope.teamId = teamId;
            var myPopup = $ionicPopup.show({
                title: 'Add Score',
                templateUrl: 'templates/add_new_score.html',
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
                                e.preventDefault()
                            } else {
                                $scope.addNewScore()
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.game.newScore = null
            })
        };

        $scope.addNewScore = function () {
            $scope.game.teams[$scope.teamId].scores.push(parseInt($scope.game.newScore));
            $window.localStorage['game'] = JSON.stringify($scope.game);
            if ($scope.totalScore($scope.game.teams[$scope.teamId].scores) >= $scope.game.maxscore) {
                var alertPopup = $ionicPopup.alert({
                    title: $scope.game.teams[$scope.teamId].members[0].name + " / " + $scope.game.teams[$scope.teamId].members[1].name + ' won',
                    buttons: [{text: 'OK', type: 'button-dark'}]
                });
                alertPopup.then(function (res) {
                    $window.localStorage.removeItem('game');
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $scope.updateMatchHistory();
                    $scope.updatePlayers();
                    $state.go('home')
                })
            }
        };

        $scope.updateMatchHistory = function() {
            if($scope.game.teams[0].members[0].name === "Player 1") { return }
            var history = {"teams":[{"members":[],"score":""},{"members":[],"score":""}],"date":null};
            history.date = new Date();
            if ($scope.teamId == 0) {
                history.teams[0].members.push($scope.game.teams[0].members[0].name);
                history.teams[0].members.push($scope.game.teams[0].members[1].name);
                history.teams[0].score = $scope.totalScore($scope.game.teams[0].scores);
                history.teams[1].members.push($scope.game.teams[1].members[0].name);
                history.teams[1].members.push($scope.game.teams[1].members[1].name);
                history.teams[1].score = $scope.totalScore($scope.game.teams[1].scores);
                $scope.game.teams[0].members[0].wins += 1;
                $scope.game.teams[0].members[1].wins += 1;
                $scope.game.teams[1].members[0].losses += 1;
                $scope.game.teams[1].members[1].losses += 1;
            }
            else {
                history.teams[0].members.push($scope.game.teams[1].members[0].name);
                history.teams[0].members.push($scope.game.teams[1].members[1].name);
                history.teams[0].score = $scope.totalScore($scope.game.teams[1].scores);
                history.teams[1].members.push($scope.game.teams[0].members[0].name);
                history.teams[1].members.push($scope.game.teams[0].members[1].name);
                history.teams[1].score = $scope.totalScore($scope.game.teams[0].scores);
                $scope.game.teams[0].members[0].losses += 1;
                $scope.game.teams[0].members[1].losses += 1;
                $scope.game.teams[1].members[0].wins += 1;
                $scope.game.teams[1].members[1].wins += 1;
            }
            $scope.history.push(history);
            $window.localStorage['history'] = JSON.stringify($scope.history);
        };

        $scope.updatePlayers = function() {
            if($scope.game.teams[0].members[0].name === "Player 1") { return }
            $scope.updatePlayer($scope.game.teams[0].members[0]);
            $scope.updatePlayer($scope.game.teams[0].members[1]);
            $scope.updatePlayer($scope.game.teams[1].members[0]);
            $scope.updatePlayer($scope.game.teams[1].members[1]);
            $window.localStorage['players'] = JSON.stringify($scope.players);
        };

        $scope.updatePlayer = function(player) {
            for(var i = 0; i < $scope.players.length; i++) {
                if($scope.players[i].name == player.name) {
                    $scope.players[i] = player;
                    break;
                }
            }
        };
    }])

    .controller('MatchHistoryCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
        $timeout(function () {
            $scope.history = JSON.parse($window.localStorage['history'])
        }, 300);
        $scope.clearMatchHistory = function () {
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
                            $window.localStorage['history'] = JSON.stringify([]);
                            $scope.history = []
                        }
                    }
                ]
            });
        }
    }])

    .controller('PlayerRecordsCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
        $timeout(function () {
            $scope.players = JSON.parse($window.localStorage['players'] || '[]');
        }, 300);
        $scope.clearPlayerRecords = function() {
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
                            for(var i = 0; i < $scope.players.length; i++) {
                                $scope.players[i].wins = 0;
                                $scope.players[i].losses = 0;
                            }
                            $window.localStorage['players'] = JSON.stringify($scope.players)
                        }
                    }
                ]
            });
        }
    }])

    .controller('PlayerManagerCtrl', ['$scope', '$window', '$timeout', '$ionicPopup', function ($scope, $window, $timeout, $ionicPopup) {
        $timeout(function () {
            $scope.players = JSON.parse($window.localStorage['players'] || '[]');
            $scope.players.newPlayer = null
        }, 300);
        $scope.showAddPlayerPopup = function () {
            var myPopup = $ionicPopup.show({
                title: 'Add Player',
                templateUrl: 'templates/add_new_player.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel', type: 'button-outline button-dark'
                    },
                    {
                        text: '<b>Add</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                            if ($scope.players.newPlayer == null) {
                                e.preventDefault()
                            } else {
                                $scope.addNewPlayer()
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.players.newPlayer = null
            })
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
                return a.name.localeCompare(b.name)
            });
            $window.localStorage['players'] = JSON.stringify($scope.players)
        };
        $scope.showEditPlayerPopup = function (index) {
            $scope.players.newPlayer = $scope.players[index].name;
            var myPopup = $ionicPopup.show({
                title: 'Edit Player',
                templateUrl: 'templates/add_new_player.html',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel', type: 'button-outline button-dark'
                    },
                    {
                        text: '<b>Edit</b>',
                        type: 'button-dark',
                        onTap: function (e) {
                            if ($scope.players.newPlayer == null) {
                                e.preventDefault()
                            } else {
                                $scope.renamePlayer(index)
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.players.newPlayer = null
            })
        };
        $scope.renamePlayer = function (index) {
            $scope.players[index].name = $scope.players.newPlayer;
            $scope.players.sort(function (a, b) {
                return a.name.localeCompare(b.name)
            });
            $window.localStorage['players'] = JSON.stringify($scope.players)
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
                            $window.localStorage['players'] = JSON.stringify($scope.players)
                        }
                    }
                ]
            });
        }
    }]);