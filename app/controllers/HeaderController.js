emmetApp.controller('HeaderController', ['$scope', '$routeParams', 'SymbolsService', function ($scope, $routeParams, SymbolsService) 
{
	$scope.appTitle = SymbolsService.appTitle;
	$scope.appSubTitle = SymbolsService.appSubTitle;
	
}]);