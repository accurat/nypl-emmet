emmetApp.directive('where', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: 
		{
			
		},
		controller: 'WhereController',
		templateUrl: 'Where.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
});