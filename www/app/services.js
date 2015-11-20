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
    if (this.firstName !== '' && this.lastName !== '') {
      this.fullName = this.firstName + ' ' + this.lastName;
    } else {
      this.fullName = '';
    }
    this.id = id || '';
    this.wins = wins || 0;
    this.losses = losses || 0;
    this.win = function () {
      this.wins++;
    };
    this.lose = function () {
      this.losses++;
    };
  };

  var playerId = JSON.parse($window.localStorage.playerId || '1');
  var Players = JSON.parse($window.localStorage.Players || '[]');

  Players.forEach(function () {
    return function (player) {
      Players[player.id] = player;
    };
  });

  this.new = function (firstName, lastName, id, wins, losses) {
    var player = new Player(firstName, lastName, id, wins, losses);
    return player;
  };

  this.create = function (firstName, lastName) {
    var player = new Player(firstName, lastName, playerId++);
    $window.localStorage.playerId = JSON.stringify(playerId);
    Players[player.id] = player;
    $window.localStorage.Players = JSON.stringify(Players);
    return player;
  };

  this.get = function (playerId) {
    return Players[playerId];
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
    return Players.filter(function (player) {
      return player !== null;
    });
  };
}]);
