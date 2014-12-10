angular.module('sshfs', [
	'ngMaterial',
	'ngAnimate',
	'ui.router',
	'htmlTemplates', //created by gulp
	//add for each route - not automated
	'titleService',
	'sshfs.home'
])

.config(function($stateProvider, $urlRouterProvider) {})

.run(function run() {})

.controller('AppCtrl', function AppCtrl($scope, titleService, $mdSidenav) {
	titleService.set('SSH for Shits');

	$scope.openMenu = function() {
		$mdSidenav('left').open();
	};
	$scope.closeMenu = function() {
		$mdSidenav('left').close();
	};

	//TODO: make this actually a service or (probably) a directive
	$scope.notificationCount = 3;
});