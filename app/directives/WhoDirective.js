emmetApp.directive('who', ['DataService', function(DataService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: 
		{
			
		},
		template: 
			'<div class="who" ng-transclude></div>',
		link: function(scope, element, attrs)
		{
			
		}
	};
}]);