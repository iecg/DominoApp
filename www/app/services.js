angular.module('services', [])

.service('Players', ['$window', function($window) {
  var Player = function(firstName, lastName, id, wins, losses) {
    if(typeof firstName === 'string') {
      this.firstName = firstName[0].toUpperCase();
      this.firstName += firstName.slice(1);
    } else {
      this.firstName = '';
    };
    if(typeof lastName === 'string') {
      this.lastName = lastName[0].toUpperCase();
      this.lastName += lastName.slice(1);
    } else {
      this.lastName = '';
    };
    this.fullName = this.firstName + ' ' + this.lastName; 
    this.id = id || '';
    this.wins = wins || 0;
    this.losses = losses || 0;
    this.win = function() {
      this.wins++;
    };
    this.lose = function() {
      this.losses++;
    ;}
  };

  var Players_ = JSON.parse($window.localStorage.Players || '[]');
  
  var Players = [];

  Players_.forEach(function(player_, id) {
    var player = new Player(player_.firstName, player_.lastName, id, player_.wins, player_.losses);
    Players.push(player);
  });

  this.new = function(firstName, lastName, id, wins, losses) {
    var player = new Player(firstName, lastName, id, wins, losses);
    return player;
  };

  this.all = function() {
    return Players;
  };
}])
