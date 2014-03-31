emmetApp.directive('popup', ['HighlightService', '$window', function (HighlightService, $window) {
	return {
		restrict: 'E',
		replace: true,
		scope: false,
		controller: 'PopupController',
		templateUrl: 'app/templates/PopupTemplate.html',
		link: function (scope, element) {

			//TODO fix when fixed the final css for popup
			var popupWidth = 258,
				popupHeight = 356,
				margin = 10;

			scope.$watch(
				function () {return HighlightService.getLetterId();},
				function (newValue, oldValue) 
				{
					if (newValue) {scope.show(newValue);}
					else {scope.hide();}
				}, true);


			scope.show = function (newValue) {
				var body = angular.element('body')[0];
				var coordinates = d3.mouse(body);
				var windowWidth = $window.outerWidth;
				var windowHeight = $window.outerHeight;
				var x = coordinates[0] > windowWidth - popupWidth ? coordinates[0] - popupWidth + margin : coordinates[0] + margin;
				var y = coordinates[1] > windowHeight - popupHeight ? coordinates[1] - popupHeight + margin : coordinates[1] + margin;


				d3.select(".popup-container")
					.style("visibility", "visible")
					.style("top", y + "px")
					.style("left", x + "px");
			};

			scope.hide = function () {
				d3.select(".popup-container").style("visibility", "hidden");
			};

		}
	};
}]);