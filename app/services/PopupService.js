emmetApp.factory('PopupService', ['$window', function($window)
{
	var popupIsVisible = false;
	var popupIsPersistent = false;
	
	var popupWidth = 727;
	var popupHeight = 463;
	var spacingHorizontal = 10;
	var spacingVertical = 10;
	var padding = 40;
	
	return {
		
		setPersistent: function(isPersistent) {popupIsPersistent = isPersistent;},
		
		isPersistent: function() {return popupIsPersistent;},
		
		isVisible: function() {return popupIsVisible;},
		
		showPopup: function() {
			var body = angular.element('body')[0];
			var coordinates = d3.mouse(body);
			var windowWidth = $window.innerWidth;
			var windowHeight = $window.innerHeight;
			var x = coordinates[0] > (windowWidth - popupWidth - padding) ? coordinates[0] - popupWidth - spacingHorizontal : coordinates[0] + spacingHorizontal;
			var y = coordinates[1] > (windowHeight - popupHeight - padding) ? coordinates[1] - popupHeight - spacingVertical : coordinates[1] + spacingVertical;

			d3.select(".popup-container")
				.style("visibility", "visible")
				.style("top", y + "px")
				.style("left", x + "px");
			
			popupIsVisible = true;
		},
		
		hidePopup: function() {
			d3.select(".popup-container").style("visibility", "hidden");
			popupIsVisible = false;
		},
		
		reset: function() {
			popupIsPersistent = false;
			d3.select(".popup-container").style("visibility", "hidden");
			popupIsVisible = false;
		}
		
	};
}]);