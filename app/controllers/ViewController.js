emmetApp.controller('ViewController', ['$scope', 'SymbolsService', 'LocationService', function ($scope, SymbolsService, LocationService) 
{
	$scope.whenUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
	$scope.whenLabel = 'when';
	
	$scope.whereUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhere);
	$scope.whereLabel = 'where';
	
	$scope.displayView = function(selectedView) {
		
		if (selectedView == 'when')
		{
			window.location = $scope.whenUrl;
		}
		else if (selectedView == 'where')
		{
			window.location = $scope.whereUrl;
		}
	};
	
}]);