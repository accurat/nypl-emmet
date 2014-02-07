emmetApp.directive('when', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: 
		{
			
		},
		template: 
			'<div class="when" ng-transclude></div>',
		link: function (scope, element) 
		{
			
		}
	};
});