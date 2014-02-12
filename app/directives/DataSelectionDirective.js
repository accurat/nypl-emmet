emmetApp.directive('dataselection', ['SymbolsService', 'LocationService', function(SymbolsService, LocationService) 
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
			var accuratUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, SymbolsService.dataAccurat);
			var accuratLabel = 'accurat';
			var accuratElementClass = 'data accurat';
			
			var emmetUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, SymbolsService.dataEmmet);
			var emmetLabel = 'emmet';
			var emmetElementClass = 'data emmet';
			
			var directiveTemplate = '<div class="data-selection-container">';
			directiveTemplate += '<span class="' + accuratElementClass + '"><a href="' + accuratUrl + '">' + accuratLabel + '</a></span>';
			directiveTemplate += '<span> &#47; </span>';
			directiveTemplate += '<span class="' + emmetElementClass + '"><a href="' + emmetUrl + '">' + emmetLabel + '</a></span>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);