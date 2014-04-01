emmetApp.directive('topicselection', function() 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'TopicSelectionController',
		templateUrl: 'app/templates/TopicSelection.tpl.html',
		link: function (scope, element) 
		{
			
		}
	};
});