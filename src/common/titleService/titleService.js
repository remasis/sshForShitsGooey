angular.module('titleService', [])
	.factory('titleService', ['$window',
		function($window) {
			var title = "SSH For Shits Gooey";
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