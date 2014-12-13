angular.module('sshfs.home', [
	'ui.router'
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

.controller('homeCtrl', function HomeController($scope, $interval, $timeout, $http, $q, $anchorScroll, $location, titleService) {
	titleService.push("Live View");

	//location hack for autoscroll...
	$location.hash('bottom');

	var actindex = 0;
	var lastId;
	var timer;
	$scope.$on("$destroy", function() {
        if (timer) {
            $timeout.cancel(timer);
        }
        titleService.pop();
    });

	function displayTyped(str) {
		var i = 0;
		var def = $q.defer();

		$interval(function() {
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

	function loadShell() {
		$http.get('/api/shells/recent')
			.success(function(data) {
				if (lastId === data[0]._id) {
					//do nothing it's the same
					// console.log('no change');
					$timeout(loadShell,15000);
				} else {
					// console.log("CHANGED");
					lastId = data[0]._id;
					actindex = 0;
					$scope.shelloutput = [];
					$scope.shell = data[0];
					// console.log($scope.shell);
					shownext();
				}
			})
			.error(function(data) {
				console.error("ZOMG ERROR getting shell db:", data);
			});
	}

	function shownext() {
		if (actindex >= $scope.shell.shellactivity.length) {
			// console.log("all done with data");
			$timeout(loadShell, 3000);
			return;
		}
		var act = $scope.shell.shellactivity[actindex];
		$scope.shelloutput[actindex] = {
			cmd: "",
			resp: ""
		};
		displayTyped(act.cmd).then(function() {
			$scope.shelloutput[actindex].resp = act.resp.split("\n");
			actindex = actindex + 1;
			$timeout($anchorScroll, 1);
			$timeout(shownext, 1000);
		});
	}

	loadShell();

});