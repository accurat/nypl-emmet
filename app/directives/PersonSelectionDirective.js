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
		template: function()
		{
			var label = "people";
			var personUrl = LocationService.getUrlToToken(SymbolsService.urlTokenData) + '/' + SymbolsService.urlTokenView + '/' + SymbolsService.viewWho + '/' + SymbolsService.urlTokenPerson + '/';
			
			var directiveTemplate;
			directiveTemplate  = '<div class="person-selection-container">';
				directiveTemplate += '<div class="view who">' + label + '</div>';
				directiveTemplate += '<div><input class="person-selection-input" type="text" ng-model="personName" placeholder=""></div>';
				directiveTemplate += '<div class="person-selection-list" ng-hide="!matchingPeople.length">'; 
					directiveTemplate += '<ul class="person-list">';						
						directiveTemplate += '<li ng-repeat="person in matchingPeople"><a class="person-item" ng-mouseenter="setHighlightPerson(person.id)" ng-mouseleave="setHighlightPerson(null)" href="' + personUrl +'{{person.id}}">{{person.name}}</a></li>';
					directiveTemplate += '</ul>';
				directiveTemplate += '</div>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);