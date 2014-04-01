emmetApp.directive('who', function(DataService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: 
		{
			
		},
		controller: 'WhoController',
		templateUrl: 'app/templates/Who.tpl.html',
		link: function(scope, element, attrs)
		{
			
		}
	};
});