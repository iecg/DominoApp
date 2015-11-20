angular.module('services', [])

.service('Players', ['$window', '$timeout', function ($window, $timeout) {
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
    this.id = id || '';
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

  this.create = function (firstName, lastName) {
    var player = new Player(firstName, lastName, playerId++);
    player.fullName = fullName;
    player.win = win;
    player.lose = lose;
    Players[player.id] = player;
    $window.localStorage.playerId = JSON.stringify(playerId);
    $window.localStorage.Players = JSON.stringify(Players);
    return player;
  };

  this.get = function (playerId) {
    var player = Players[playerId];
    player.fullName = fullName;
    player.win = win;
    player.lose = lose;
    return player;
  };

  this.update = function (player) {
    Players[player.id] = player;
    $window.localStorage.Players = JSON.stringify(Players);
  };

  this.delete = function (player) {
    delete Players[player.id];
    $window.localStorage.Players = JSON.stringify(Players);
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
}]);
