emmetApp.controller('TitlesController', ['$scope', '$routeParams', 'SymbolsService', function ($scope, $routeParams, SymbolsService) 
{
	$scope.appTitle = SymbolsService.appTitle;
	$scope.appSubTitle = SymbolsService.appSubTitle;
	
}]);