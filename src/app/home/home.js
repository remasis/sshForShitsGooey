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

.controller('homeCtrl', function HomeController($scope, titleService, $interval, $timeout, $http, $q, $anchorScroll, $location) {
	console.log("hello from home");
	titleService.set("SSH For Shits");

	//location hack....
	$location.hash('bottom');

	function displayTyped(str) {
		var i = 0;
		var def = $q.defer();

		var timer = $interval(function() {
			if (i < str.length) {
				$scope.shelloutput[actindex].cmd += str[i];
				$anchorScroll();
			} else {
				$interval.cancel(timer);
				def.resolve();
			}
			i++;
		}, 100);
		return def.promise;
	}

	$http.get('/api/shells/recent')
		.success(function(data) {
			$scope.shell = data[0];
			console.log($scope.shell);
			shownext();
		})
		.error(function(data) {
			console.error("ZOMG ERROR getting shell db:", data);
		});

	$scope.shelloutput = [];

	var actindex = 0;

	function shownext() {
		if (actindex >= $scope.shell.shellactivity.length) {
			console.log("all done with data");
			return;
		}
		var act = $scope.shell.shellactivity[actindex];
		$scope.shelloutput[actindex] = {
			cmd: "",
			resp: ""
		};
		displayTyped(act.cmd).then(function() {
			$scope.shelloutput[actindex].resp = act.resp;
			actindex = actindex + 1;
			$timeout($anchorScroll, 1);
			$timeout(shownext, 1000);
		});
	}
});