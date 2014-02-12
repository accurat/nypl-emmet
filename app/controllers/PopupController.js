emmetApp.controller('PopupController', ['$scope', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', function ($scope, $routeParams, DataService, SymbolsService, HighlightService) 
{
	$scope.letter = null;
	$scope.formattedLetterDate = null;
	
	$scope.$watch(function() {return HighlightService.getLetterId();}, 
			function (newValue, oldValue) 
			{
				if (newValue)
				{
					$scope.letter = DataService.getLetterById($routeParams.dataType, newValue);
					
					var date = new Date($scope.letter.date);
					var options = {weekday: "long", year: "numeric", month: "short", day: "numeric"};
					
					$scope.formattedLetterDate = date.toLocaleDateString("en-us", options);
				}
				else 
				{
					$scope.letter = null;
					$scope.formattedLetterDate = null;
				}
			}, true);
	
}]);