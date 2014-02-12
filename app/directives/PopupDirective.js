emmetApp.directive('popup', ['DataService', 'TimeService', 'CanvasService', 'ColorService', 'SymbolsService', 'LocationService', '$routeParams', 'HighlightService', function(DataService, TimeService, CanvasService, ColorService, SymbolsService, LocationService, $routeParams, HighlightService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'PopupController',
		template: function()
		{
			var directiveTemplate = '<div class="popup-container">';
				directiveTemplate += '<div class="popup-contents">';
					directiveTemplate += 'From: {{letter.authors[0].name}}<br/><br/>';
					directiveTemplate += 'To: {{letter.recipients[0].name}}<br/><br/>';
					directiveTemplate += '{{letter.place.name}}<br/>';
					directiveTemplate += '{{formattedLetterDate}}<br/><br/>';					
					directiveTemplate += '{{letter.emmetContent}}.<br/>';
				directiveTemplate += '</div>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			scope.$watch(
					function() {return HighlightService.getLetterId();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							scope.display(newValue);
						}	
						else
						{
							scope.hide();
						}
					}, true);
			
			
			scope.display = function(letterId)
			{
				
				var coordinates = [0, 0];
				coordinates = d3.mouse(d3.select("document.body"));
				var x = coordinates[0];
				var y = coordinates[1];
				
				d3.select(".popup-container")
					.style("visibility", "visible")
					.style("top", y)
					.style("left", x);
			};
			
			scope.hide = function()
			{
				d3.select(".popup-container").style("visibility", "hidden");
			};
			
		}
	};
}]);