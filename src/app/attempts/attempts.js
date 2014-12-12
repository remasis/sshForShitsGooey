angular.module('sshfs.attempts', [
	'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('attempts', {
			url: "/attempts",
			templateUrl: 'attempts/attempts.tpl.html',
			controller: 'attemptsCtrl'
		});
})

.run(function() {})

.controller('attemptsCtrl', function HomeController($scope, $http, $location) {
	$http.get('/api/attempts/')
		.success(function(data) {
			$scope.attempts = data;
		})
		.error(function(data) {
			console.error("ZOMG ERROR getting attempt db:", data);
		});
});