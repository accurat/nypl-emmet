emmetApp.controller('PopupController', ['$scope', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'LocationService', 'PopupService', function ($scope, $routeParams, DataService, SymbolsService, HighlightService, LocationService, PopupService) 
{
	
	$scope.alignElements = function() {
		var placeHeight = (Math.floor($scope.letter.place.name.length / 30) + 1) * 22;
		var topicHeight = (Math.floor($scope.letter.chapterName.length / 30) + 1) * 22;
		var totalHeight = (2 * 18) + placeHeight + topicHeight; 
		var margin = 250 - totalHeight;
		$('.pull-down').each(function() {$(this).css('margin-top', margin);});
	};
	
	
	
	
	
	$scope.letter = null;
	$scope.formattedLetterDate = null;
	
	$scope.$watch(function() {return HighlightService.getLetterId();}, 
			function (newValue, oldValue) 
			{
				if (!PopupService.isPersistent())
				{
					if (newValue)
					{
						$scope.letter = DataService.getLetterById($routeParams.dataType, newValue);
						
						var date = new Date($scope.letter.date);
						var options = {weekday: "long", year: "numeric", month: "short", day: "numeric"};
						
						$scope.formattedLetterDate = date.toLocaleDateString("en-us", options);
						$scope.alignElements();
					}
					else 
					{
						$scope.letter = null;
						$scope.formattedLetterDate = null;
					}
				}
			}, true);
	
	$scope.openPersonTimeline = function(personId) {
		var url = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWho);
    	url = LocationService.setUrlParameter(SymbolsService.urlTokenPerson, personId);
    	window.location = url;
	};
	
	$scope.closePopup = function() {
		HighlightService.setLetterHoverId(null);
	};
	
}]);