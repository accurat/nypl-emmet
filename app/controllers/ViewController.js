emmetApp.controller('ViewController', ['$scope', 'SymbolsService', 'LocationService', '$routeParams', function ($scope, SymbolsService, LocationService, $routeParams) 
{
	$scope.whenLabel = 'when';
	$scope.whereLabel = 'where';
	$scope.whereSnakeLabel = 'Snake!';
	$scope.whereContemporaryLabel = 'Less fun';
	
	$scope.isWhereListVisible = false;
	
	$scope.displayWhereList = function()
	{
		if (!$scope.isWhereListVisible) d3.selectAll(".menu-element").filter(".where").style("visibility", "visible");
		else d3.selectAll(".menu-element").filter(".where").style("visibility", "hidden");
		$scope.isWhereListVisible = !$scope.isWhereListVisible;
	};
	
	$scope.$watch(function() {return $routeParams.viewType;}, 
			function (newValue, oldValue) 
			{
				if (newValue && (newValue == SymbolsService.viewWhen || newValue == SymbolsService.viewWho))
				{
					d3.selectAll(".menu-element").filter(".where").classed("active", false);
					if ($scope.isWhereListVisible)
					{
						d3.selectAll(".menu-element").filter(".where").style("visibility", "hidden");
						$scope.isWhereListVisible = !$scope.isWhereListVisible;
					}
				}
			}, true);
	
	
	$scope.displayView = function(selectedView) {
		
		if (selectedView == 'when')
		{
			$scope.whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, $routeParams.dataType);
			$scope.whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
			window.location = $scope.whenUrl;
		}
		else if (selectedView == 'where-snake')
		{
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, $routeParams.dataType);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhere);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenMap, SymbolsService.mapSnake);
			window.location = $scope.whereUrl;
		}
		else if (selectedView == 'where-contemporary')
		{
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, $routeParams.dataType);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhere);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenMap, SymbolsService.mapContemporary);
			window.location = $scope.whereUrl;
		}
	};
	
}]);