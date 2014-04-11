emmetApp.controller('PersonSelectionController', ['$scope', '$filter', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'LocationService', function ($scope, $filter, $routeParams, DataService, SymbolsService, HighlightService, LocationService) 
{
	$scope.personName = null;
	$scope.label = "people";
	$scope.personUrl = LocationService.getUrlToToken(SymbolsService.urlTokenData) + '/' + SymbolsService.urlTokenView + '/' + SymbolsService.viewWho + '/' + SymbolsService.urlTokenPerson + '/';
	$scope.matchingPeople = new Array();
	
	
	
	
	$scope.$watch('personName', 
		function (newValue, oldValue) 
		{
			if (newValue) 
			{
				d3.selectAll(".menu-item").filter(".person").classed("active", true);
				
				var peopleCollection;
				var data = DataService.getData(null, null, null);
				if ($routeParams.dataType == SymbolsService.dataAccurat) peopleCollection = data.accuratPeople;
				else peopleCollection = data.emmetPeople;
				
				$scope.matchingPeople = $filter('personFilter')(peopleCollection, newValue);
				
			}
			else
			{
				d3.selectAll(".menu-item").filter(".person").classed("active", false);
				$scope.matchingPeople = new Array();
			}
		}, true);
	
	
	$scope.setHighlightPerson = function(personId)
	{
		HighlightService.setPersonHoverId(personId);
	};
	
	$scope.openPersonTimeline = function(personId)
	{
		var url = '#' + SymbolsService.urlTokenData + '/' + $routeParams.dataType + '/' + SymbolsService.urlTokenView + '/' + SymbolsService.viewWho + '/' + SymbolsService.urlTokenPerson + '/'+ personId;
		$scope.personName = null;
		window.location = url;
		
	};
	

}]);