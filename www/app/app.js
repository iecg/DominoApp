angular.module('DominoApp', ['ionic', 'game', 'menu', 'matches', 'newGame', 'players', 'directives', 'filters', 'services'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('about', {
    url: '/about',
    templateUrl: 'app/about/about.html'
  })
  .state('game', {
    url: '/game',
    templateUrl: 'app/game/game.html',
    controller: 'GameCtrl'
  })
  .state('menu', {
    url: '/',
    templateUrl: 'app/menu/menu.html',
    controller: 'MenuCtrl'
  })
  .state('matches', {
    url: '/matches',
    templateUrl: 'app/matches/matches.html',
    controller: 'MatchesCtrl'
  })
  .state('new_game', {
    url: '/new_game',
    templateUrl: 'app/new_game/new_game.html',
    controller: 'NewGameCtrl'
  })
  .state('players', {
    url: '/players',
    templateUrl: 'app/players/players.html',
    controller: 'PlayersCtrl'
  });
});
