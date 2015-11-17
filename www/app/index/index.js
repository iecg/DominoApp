angular.module('app.index', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'app/index/index.html',
    controller: 'IndexCtrl'
  });
})

.controller('IndexCtrl', ['$scope', '$state', '$ionicPopup', '$window', '$ionicHistory', function($scope, $state, $ionicPopup, $window, $ionicHistory){
  $scope.continueGame = function(){
    if (angular.equals({}, JSON.parse($window.localStorage.game || '{}'))){
      $ionicPopup.alert({
        title: 'There is no saved game',
        buttons: [{text: 'OK', type: 'button-dark'}]
      });
    }
    else {
      $state.go('game');
    }
  };
}]);
