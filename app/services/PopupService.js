emmetApp.factory('PopupService', ['$window', function($window)
{
	var popupIsVisible = false;
	var popupIsPersistent = false;
	
	var popupWidth = 258;
	var popupHeight = 356;
	var margin = 10;
	
	
	return {
		
		setPersistent: function(isPersistent) {popupIsPersistent = isPersistent;},
		
		isPersistent: function() {return popupIsPersistent;},
		
		isVisible: function() {return popupIsVisible;},
		
		showPopup: function() {
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
			
			popupIsVisible = true;
		},
		
		hidePopup: function() {
			d3.select(".popup-container").style("visibility", "hidden");
			popupIsVisible = false;
		}
		
	};
}]);