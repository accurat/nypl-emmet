emmetApp.controller('OrderByController', ['$scope', '$filter', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'ColorService', function ($scope, $filter, $routeParams, DataService, SymbolsService, HighlightService, ColorService) 
{
	$scope.isOrderByListVisible = false;	
	
	$scope.displayOrderByList = function()
	{
		if (!$scope.isOrderByListVisible)
		{
			d3.select(".order-by-selection-list")
				.style("visibility", "visible");
		}
		else
		{
			d3.select(".order-by-selection-list")
				.style("visibility", "hidden");
		}
		
		$scope.isOrderByListVisible = !$scope.isOrderByListVisible;
	};
	
}]);