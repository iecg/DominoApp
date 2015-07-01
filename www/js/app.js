// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('DominoApp', ['ionic', 'DominoApp.controllers'])

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

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })

            .state('new_game', {
                url: '/new_game',
                templateUrl: 'templates/new_game.html',
                controller: 'NewGameCtrl'
            })

            .state('game', {
                url: '/game',
                templateUrl: 'templates/game.html',
                controller: 'GameCtrl'
            })

            .state('match_history', {
                url: '/match_history',
                templateUrl: 'templates/match_history.html',
                controller: 'MatchHistoryCtrl'
            })

            .state('about', {
                url: '/about',
                templateUrl: 'templates/about.html'
            })

            .state('player_records', {
                url: '/player_records',
                templateUrl: 'templates/player_records.html',
                controller: 'PlayerRecordsCtrl'
            })

            .state('player_manager', {
                url: '/player_manager',
                templateUrl: 'templates/player_manager.html',
                controller: 'PlayerManagerCtrl'
            });

        $ionicConfigProvider.views.maxCache(0);

        // if none of the above states are matched, use this as the fallback
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