emmetApp.directive('view', ['SymbolsService', 'LocationService', function(SymbolsService, LocationService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		template: function()
		{
			var whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
			var whenLabel = 'when';
			var whenElementClass = 'view when'; 
			
			var whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhere);
			var whereLabel = 'where';
			var whereElementClass = 'view where'; 

			var directiveTemplate = '<div class="view-container">';
			directiveTemplate += '<span class="' + whenElementClass + '"><a href="' + whenUrl + '">' + whenLabel + '</a></span>';
			directiveTemplate += '<span> &#47; </span>';
			directiveTemplate += '<span class="' + whereElementClass + '"><a href="' + whereUrl + '">' + whereLabel + '</a></span>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);