angular.module('app.about', [])

.config(function($stateProvider){
  $stateProvider
  .state('about', {
    url: '/about',
    templateUrl: 'app/about/about.html'
  });
});
