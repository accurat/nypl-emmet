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
			d3.selectAll(".menu-element").filter(".topic").style("visibility", "visible");
			d3.selectAll(".menu-item").filter(".topic").classed("active", true);
		}
		else
		{
			d3.selectAll(".menu-element").filter(".topic").style("visibility", "hidden");
			d3.selectAll(".menu-item").filter(".topic").classed("active", false);
		}
		
		$scope.isTopicListVisible = !$scope.isTopicListVisible;
	};
	
	$scope.$watch(
		function() {return HighlightService.getTopicId();}, 
		function (newValue, oldValue) 
		{
			if (newValue) 
			{
				console.log(newValue);
				d3.selectAll(".menu-element-text").filter(".topic").classed("opacized", true);
				d3.selectAll(".menu-bullet").filter(".topic").classed("opacized", true);
				
				d3.selectAll(".menu-element-text").filter(".topic").filter(".t" + newValue).classed("opacized", false);
				d3.selectAll(".menu-bullet").filter(".topic").filter(".t" + newValue).classed("opacized", false);
			}	
			else
			{
				d3.selectAll(".menu-element-text").filter(".topic").classed("opacized", false);
				d3.selectAll(".menu-bullet").filter(".topic").classed("opacized", false);
			}
		}, true);
	
}]);