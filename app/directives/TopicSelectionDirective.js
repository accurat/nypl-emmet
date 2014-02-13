emmetApp.directive('topicselection', ['SymbolsService', 'LocationService', 'HighlightService', function(SymbolsService, LocationService, HighlightService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'TopicSelectionController',
		template: function()
		{
			var label = "topics";
			
			var directiveTemplate;
			directiveTemplate  = '<div class="topic-selection-container">';
				directiveTemplate += '<div class="topic"><span ng-mousedown="displayTopicList()">' + label + '</span></div>';
				
				directiveTemplate += '<div class="topic-selection-list">'; 
					directiveTemplate += '<ul class="topic-list">';						
						directiveTemplate += '<li ng-repeat="topic in topics">';
							directiveTemplate += '<span class="topic-item t{{topic.id}}" ng-mouseenter="setHighlightTopic(topic.id)" ng-mouseleave="setHighlightTopic(null)">{{topic.name}}</span>';
							directiveTemplate += '<span class="topic-bullet t{{topic.id}}" style="background: {{getTopicColor(topic.id)}};"></span>';
						directiveTemplate += '</li>';
					directiveTemplate += '</ul>';
				directiveTemplate += '</div>';
				
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			scope.$watch(
					function() {return HighlightService.getTopicId();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							d3.selectAll(".topic-bullet").classed("highlighted", true);
							d3.selectAll(".topic-bullet").filter(".t" + newValue).classed("highlighted", false);
							d3.selectAll(".topic-item").classed("highlighted", true);
							d3.selectAll(".topic-item").filter(".t" + newValue).classed("highlighted", false);
						}	
						else
						{
							d3.selectAll(".topic-bullet").classed("highlighted", false);
							d3.selectAll(".topic-item").classed("highlighted", false);
						}
					}, true);
		}
	};
}]);