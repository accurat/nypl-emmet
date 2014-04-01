emmetApp.directive('view', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'ViewController',
		templateUrl: 'app/templates/View.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
});