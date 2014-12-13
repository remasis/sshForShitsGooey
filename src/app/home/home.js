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

	$scope.realtime = 'relative';

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
					$scope.shell.shellactivity = JSON.parse('[{"ts":"2014-12-13T10:58:23.940758663Z","cmd":"sh-4.3$ ls","resp":". \\n\\n\\n\\n\\n\\n\\n\\n..\\n"},{"ts":"2014-12-13T10:58:27.980758599Z","cmd":"sh-4.3$ ls ../","resp":"ls: cannot access ../: No such file or directory\\n"},{"ts":"2014-12-13T10:58:33.90469407Z","cmd":"sh-4.3$ cd ..","resp":"sh: cd: command not found\\n"},{"ts":"2014-12-13T10:58:47.6647103Z","cmd":"sh-4.3$ ls /bin","resp":"ls: cannot access /bin: No such file or directory\\n"},{"ts":"2014-12-13T10:59:09.123687166Z","cmd":"sh-4.3$ ls /","resp":"ls: cannot access /: No such file or directory\\n"},{"ts":"2014-12-13T10:59:19.759690629Z","cmd":"sh-4.3$ echo ","resp":"sh: echo: command not found\\n"},{"ts":"2014-12-13T10:59:26.855686602Z","cmd":"sh-4.3$ pwd","resp":"sh: pwd: command not found\\n"},{"ts":"2014-12-13T10:58:47.6647103Z","cmd":"sh-4.3$ ls /bin","resp":"ls: cannot access /bin: No such file or directory\\n"},{"ts":"2014-12-13T10:59:09.123687166Z","cmd":"sh-4.3$ ls /","resp":"ls: cannot access /: No such file or directory\\n"},{"ts":"2014-12-13T10:59:19.759690629Z","cmd":"sh-4.3$ echo ","resp":"sh: echo: command not found\\n"},{"ts":"2014-12-13T10:59:26.855686602Z","cmd":"sh-4.3$ pwd","resp":"sh: pwd: command not found\\n"}]');
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
