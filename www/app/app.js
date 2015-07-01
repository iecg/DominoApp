// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'app.about',
  'app.game',
  'app.home',
  'app.match_history',
  'app.new_game',
  'app.player_manager',
  'app.player_records'
])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  $urlRouterProvider.otherwise('/');
})

.directive('focusMe', function ($timeout) {
  return {
    link: function (scope, element, attrs) {
      $timeout(function () {
        element[0].focus();
      }, 200);
    }
  };
})

.filter('excludeSelectedPlayers', function () {
  return function (players, teams, teamId, memberId) {
    if (!players || !players.length) {
      return;
    }
    function comparePlayers(player_) {
      return function (player) {
        if (player.name !== player_.name) {
          return true;
        }
      };
    }
    for (var n = 0; n < 2; n++) {
      for (var m = 0; m < 2; m++) {
        if (teamId !== n || memberId !== m) {
          players = players.filter(comparePlayers(teams[n].members[m]));
        }
      }
    }
    return players;
  };
});
