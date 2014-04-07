emmetApp.directive('personselection', ['SymbolsService', 'LocationService', function(SymbolsService, LocationService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'PersonSelectionController',
		templateUrl: 'app/templates/PersonSelection.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
}]);