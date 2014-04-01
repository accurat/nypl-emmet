emmetApp.directive('orderby', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'OrderByController',
		templateUrl: 'app/templates/OrderBy.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
});