emmetApp.controller('ViewController', ['$scope', 'SymbolsService', 'LocationService', '$routeParams', function ($scope, SymbolsService, LocationService, $routeParams) 
{
	$scope.whenLabel = 'when';
	$scope.whereLabel = 'where';
	
	$scope.displayView = function(selectedView) {
		
		if (selectedView == 'when')
		{
			$scope.whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, $routeParams.dataType);
			$scope.whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
			window.location = $scope.whenUrl;
		}
		else if (selectedView == 'where')
		{
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenData, $routeParams.dataType);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhere);
			$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenMap, SymbolsService.mapSnake);
			window.location = $scope.whereUrl;
		}
	};
	
}]);