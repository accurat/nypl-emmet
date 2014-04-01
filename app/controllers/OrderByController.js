emmetApp.controller('OrderByController', ['$scope', '$filter', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'ColorService', 'LocationService', function ($scope, $filter, $routeParams, DataService, SymbolsService, HighlightService, ColorService, LocationService) 
{
	$scope.isOrderByListVisible = false;	
	
	$scope.label = "order by";
	
	$scope.authorYearUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
	$scope.authorYearUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderAuthorYear);
	$scope.authorYearLabel = 'Author volumes (per year)'; 
	
	$scope.authorTotalUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen); 
	$scope.authorTotalUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderAuthorTotal);
	$scope.authorTotalLabel = 'Author volumes (total)'; 
	
	$scope.topicUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
	$scope.topicUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderTopic);
	$scope.topicLabel = 'Topic';
	
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
	
	$scope.orderBy = function(orderBy) {
		
		if (orderBy == 'authorYear')
		{
			window.location = $scope.authorYearUrl;
		}
		else if (orderBy == 'authorTotal')
		{
			window.location = $scope.authorTotalUrl;
		}
		else if (orderBy == 'topic')
		{
			window.location = $scope.topicUrl;
		}
	};
	
}]);