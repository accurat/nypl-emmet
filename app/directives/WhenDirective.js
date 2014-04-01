emmetApp.directive('when', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: 
		{
			
		},
		controller: 'WhenController',
		templateUrl: 'When.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
});