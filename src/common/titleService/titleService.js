angular.module('titleService', [])
	.factory('titleService', ['$window',
		function($window) {
			var title = "Shells For Shits";
			var breadcrumbs = [];
			return {
				set: function(newtitle) {
					title = newtitle;
					$window.document.title = title;
				},
				get: function() {
					return title;
				},
				push: function(item){
					breadcrumbs.push(item);
				},
				pop: function(){
					breadcrumbs.pop();
				},
				clear: function(){
					breadcrumbs.length = 0;
				},
				getCrumbs: function(){
					return breadcrumbs;
				}
			};
		}
	]);