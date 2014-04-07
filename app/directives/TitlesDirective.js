emmetApp.directive('titles', ['SymbolsService', 'LocationService', '$routeParams', function(SymbolsService, LocationService, $routeParams) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'TitlesController',
		templateUrl: 'app/templates/Titles.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
}]);