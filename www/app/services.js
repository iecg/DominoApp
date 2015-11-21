angular.module('services', [])

.service('Players', ['$window', function ($window) {
  var Player = function (firstName, lastName, id, wins, losses) {
    if (typeof firstName === 'string') {
      this.firstName = firstName[0].toUpperCase();
      this.firstName += firstName.slice(1);
    } else {
      this.firstName = '';
    }
    if (typeof lastName === 'string') {
      this.lastName = lastName[0].toUpperCase();
      this.lastName += lastName.slice(1);
    } else {
      this.lastName = '';
    }
    this.id = id || 0;
    this.wins = wins || 0;
    this.losses = losses || 0;
  };

  var fullName = function () {
    if (this.firstName !== '' && this.lastName !== '') {
      return this.firstName + ' ' + this.lastName;
    } else {
      return '';
    }
  };

  var win = function () {
    this.wins++;
  };

  var lose = function () {
    this.losses++;
  };

  var playerId = JSON.parse($window.localStorage.playerId || '1');
  var Players = JSON.parse($window.localStorage.Players || '[]');

  this.new = function (firstName, lastName, id, wins, losses) {
    var player = new Player(firstName, lastName, id, wins, losses);
    player.fullName = fullName;
    player.win = win;
    player.lose = lose;
    return player;
  };

  this.create = function (player_) {
    var player = new Player(player_.firstName, player_.lastName, playerId++);
    player.fullName = fullName;
    player.win = win;
    player.lose = lose;
    Players[player.id] = player;
    $window.localStorage.playerId = JSON.stringify(playerId);
    $window.localStorage.Players = JSON.stringify(Players);
  };

  this.update = function (player) {
    Players[player.id] = player;
    $window.localStorage.Players = JSON.stringify(Players);
  };

  this.delete = function (player) {
    delete Players[player.id];
    $window.localStorage.Players = JSON.stringify(Players);
  };

  this.get = function (playerId) {
    var player = Players[playerId];
    player.fullName = fullName;
    player.win = win;
    player.lose = lose;
    return player;
  };

  this.all = function () {
    var players = Players.filter(function (player) {
      return player !== null;
    });
    for (var i = 0; i < players.length; i++) {
      players[i].fullName = fullName;
      players[i].win = win;
      players[i].lose = lose;
    }
    return players;
  };
}])

.service('Matches', ['$window', 'Players', function ($window, Players) {
  var Match = function (teams, id) {
    this.teams = teams;
    this.date = new Date();
    this.id = id || '';
  };

  var totalScore = function () {
    var totalScore = 0;
    this.score.forEach(function (score) {
      totalScore += score;
    });
    return totalScore;
  };

  var name = function () {
    return this.members[0].fullName() + ' and ' + this.members[1].fullName();
  }

  var matchId = JSON.parse($window.localStorage.matchId || '1');
  var Matches = JSON.parse($window.localStorage.Matches || '[]');

  this.create = function (teams) {
    var match = new Match(teams, matchId++);
    Matches[match.id] = match;
    $window.localStorage.matchId = JSON.stringify(matchId);
    $window.localStorage.Matches = JSON.stringify(Matches);
  };

  this.delete = function (match) {
    delete Matches[match.id];
    $window.localStorage.Matches = JSON.stringify(Matches);
  };

  this.all = function () {
    var matches = Matches.filter(function (match) {
      return match !== null;
    });
    for(var i = 0; i < matches.length; i++) {
      matches[i].teams[0].members[0] = Players.get(matches[i].teams[0].members[0].id);
      matches[i].teams[0].members[1] = Players.get(matches[i].teams[0].members[1].id);
      matches[i].teams[1].members[0] = Players.get(matches[i].teams[1].members[0].id);
      matches[i].teams[1].members[1] = Players.get(matches[i].teams[1].members[1].id);
      matches[i].teams[0].name = name;
      matches[i].teams[1].name = name;
      matches[i].teams[0].totalScore = totalScore;
      matches[i].teams[1].totalScore = totalScore;
    }
    return matches;
  };
}])

.service('Game', ['$window', 'Players', 'Matches', function ($window, Players, Matches) {
  var Team = function () {
    this.members = [];
    this.members.push(Players.new());
    this.members.push(Players.new());
    this.score = [];
  };

  var Game = function () {
    this.teams = [];
    this.teams.push(new Team());
    this.teams.push(new Team());
    this.maxScore = 200;
  };

  var totalScore = function () {
    var totalScore = 0;
    this.score.forEach(function (score) {
      totalScore += score;
    });
    return totalScore;
  };

  var name = function () {
    if (this.members[0].id !== 0) {
      return this.members[0].fullName() + ' and ' + this.members[1].fullName();
    }
    return undefined;
  }

  var loadGame = function() {
    var game = JSON.parse($window.localStorage.Game);
    if (game.teams[0].members[0].id !== 0) {
      game.teams[0].members[0] = Players.get(game.teams[0].members[0].id);
      game.teams[0].members[1] = Players.get(game.teams[0].members[1].id);
      game.teams[1].members[0] = Players.get(game.teams[1].members[0].id);
      game.teams[1].members[1] = Players.get(game.teams[1].members[1].id);
    }
    game.teams[0].totalScore = totalScore;
    game.teams[0].name = name;
    game.teams[1].totalScore = totalScore;
    game.teams[1].name = name;
    return game;
  };

  var saveGame = function(game) {
    $window.localStorage.Game = JSON.stringify(game);
  };

  var finishGame = function(winnerTeam, loserTeam) {
    if (winnerTeam.members[0].id !== 0) {
      winnerTeam.members[0].win();
      winnerTeam.members[1].win();
      loserTeam.members[0].lose();
      loserTeam.members[1].lose();
      Players.update(winnerTeam.members[0]);
      Players.update(winnerTeam.members[1]);
      Players.update(loserTeam.members[0]);
      Players.update(loserTeam.members[1]);
      Matches.create([winnerTeam, loserTeam]);
    }
  };

  this.addScore = function (teamId, score) {
    var game = JSON.parse($window.localStorage.Game);
    game.teams[teamId].score.push(parseInt(score));
    saveGame(game);
  };

  this.editScore = function (teamId, score) {
    var game = JSON.parse($window.localStorage.Game);
    game.teams[teamId].score.pop();
    game.teams[teamId].score.push(parseInt(score));
    saveGame(game);
  };

  this.load = function () {
    var game = loadGame();
    return game;
  };

  this.new = function() {
    var game = new Game();
    return game;
  };

  this.save = function(game) {
    saveGame(game);
  };

  this.checkWinner = function () {
    var game = loadGame();
    if (game.teams[0].totalScore() >= game.maxScore) {
      finishGame(game.teams[0], game.teams[1]);
      return 0;
    } else if (game.teams[1].totalScore() >= game.maxScore) {
      finishGame(game.teams[1], game.teams[0]);
      return 1;
    }
    return -1;
  };

  this.delete = function () {
    delete $window.localStorage.Game;
  };

  this.reset = function (game) {
    game.teams[0].score = [];
    game.teams[1].score = [];
    saveGame(game);
  };
}]);
