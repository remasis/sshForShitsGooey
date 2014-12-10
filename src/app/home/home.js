angular.module('sshfs.home', [
	'ui.router',
	'titleService'
])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: "/home",
			templateUrl: 'home/home.tpl.html',
			controller: 'homeCtrl'
		});
	$urlRouterProvider.otherwise("home");
})

.run(function() {})

.controller('homeCtrl', function HomeController($scope, titleService, $interval, $http) {
	console.log("hello from home");
	titleService.set("SSH For Shits");

	var content = "supernub@localhost ~/ $";

	$scope.type = "";
	var i = 0;

	var timer = $interval(function() {
		if (i < content.length) {
			$scope.type += content[i];
		} else {
			$interval.cancel(timer);
		}
		i++;
	}, 100);

});