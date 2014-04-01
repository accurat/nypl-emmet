emmetApp.directive('header', ['SymbolsService', 'LocationService', '$routeParams', function(SymbolsService, LocationService, $routeParams) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'HeaderController',
		templateUrl: 'app/templates/Header.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
}]);