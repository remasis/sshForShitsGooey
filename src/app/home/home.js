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

	$scope.realtime = 'realtime';

	//location hack for autoscroll...
	$location.hash('bottom');

	var actindex = 0;
	var lastId;
	var timer; //timer for tracking the timeout and intervals to remove if scope destroyed
	var ts; //track timestamp for real-time display
	$scope.$on("$destroy", function() {
		if (timer) {
			$timeout.cancel(timer);
		}
		titleService.pop();
	});

	function displayTyped(str) {
		var i = str.indexOf('$') + 1;
		var def = $q.defer();

		timer = $interval(function() {
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
					timer = $timeout(loadShell, 15000);
				} else {
					// console.log("CHANGED");
					lastId = data[0]._id;
					actindex = 0;
					$scope.shelloutput = [];
					$scope.shell = data[0];
					ts = new Date($scope.shell.login);
					// console.log($scope.shell);
					shownext();
				}
			})
			.error(function(data) {
				console.error("ZOMG ERROR getting shell db:", data);
			});
	}

	function shownext() {
		var act = $scope.shell.shellactivity[actindex];
		var prompt = act.cmd.substr(0, act.cmd.indexOf("$") + 1);
		var cmd = act.cmd.substr(act.cmd.indexOf("$") + 1);

		$scope.shelloutput[actindex] = {
			cmd: prompt,
			resp: ""
		};
		displayTyped(cmd).then(function() {
			var delay = 1000;
			$scope.shelloutput[actindex].resp = act.resp.split("\n");
			actindex = actindex + 1;
			$timeout($anchorScroll, 1);
			if (actindex >= $scope.shell.shellactivity.length) {
				// console.log("all done with data");
				$timeout(loadShell, 3000);
				return;
			} else {
				$scope.shelloutput[actindex] = {
					cmd: act.cmd.substr(0, act.cmd.indexOf("$") + 1),
					resp: ""
				};
				if ($scope.realtime === 'realtime') {
					delay = new Date(act.ts) - ts;
				}
				ts = new Date(act.ts);

				$timeout(shownext, delay);
			}
		});
	}

	loadShell();

});
