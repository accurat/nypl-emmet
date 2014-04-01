emmetApp.controller('TopicSelectionController', ['$scope', '$filter', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'ColorService', function ($scope, $filter, $routeParams, DataService, SymbolsService, HighlightService, ColorService) 
{
	$scope.isTopicListVisible = false;	
	
	$scope.label = "topic";
	
	$scope.topics = new Array();
	
	$scope.$watch(function() {return DataService.hasData();}, 
			function (newValue, oldValue) 
			{
				if (newValue) 
				{
					var data = DataService.getData(null, null, null);
					if ($routeParams.dataType == SymbolsService.dataAccurat) $scope.topics = data.accuratChapters;
					else $scope.topics = data.emmetChapters;
				}
				else $scope.topics = new Array();
			}, true);
	
	$scope.getTopicColor = function(topicId)
	{
		return ColorService.getChapterColor($routeParams.dataType, topicId);
	};
	
	$scope.setHighlightTopic = function(topicId)
	{
		HighlightService.setTopicHoverId(topicId);
	};
	
	$scope.displayTopicList = function()
	{
		if (!$scope.isTopicListVisible)
		{
			d3.select(".topic-selection-list")
				.style("visibility", "visible");
			d3.selectAll(".topic").classed("active", true);
		}
		else
		{
			d3.select(".topic-selection-list")
				.style("visibility", "hidden");
			d3.selectAll(".topic").classed("active", false);
		}
		
		$scope.isTopicListVisible = !$scope.isTopicListVisible;
	};
	
	$scope.$watch(
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
	
}]);