angular.module('titleService', [])
	.factory('titleService', ['$window',
		function($window) {
			var title = "Shells For Shits";
			return {
				set: function(newtitle) {
					title = newtitle;
					$window.document.title = title;
				},
				get: function() {
					return title;
				}
			};
		}
	]);