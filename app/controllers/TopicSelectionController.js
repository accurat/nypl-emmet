emmetApp.controller('TopicSelectionController', ['$scope', '$filter', '$routeParams', 'DataService', 'SymbolsService', 'HighlightService', 'ColorService', function ($scope, $filter, $routeParams, DataService, SymbolsService, HighlightService, ColorService) 
{
	$scope.isTopicListVisible = false;	
	
	$scope.activeTopicId = null;
	
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
	
	$scope.$watch(function() {return HighlightService.isPersistent();}, 
			function (newValue, oldValue) 
			{
				if (newValue == false) 
				{
					$scope.activeTopicId = null;
				}
			}, true);
	
	$scope.getTopicColor = function(topicId)
	{
		return ColorService.getChapterColor($routeParams.dataType, topicId);
	};
	
	$scope.setHighlightTopic = function(topicId)
	{
		if (!HighlightService.isPersistent()) HighlightService.setTopicHoverId(topicId);
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
			if (!HighlightService.isPersistent()) d3.selectAll(".menu-item").filter(".topic").classed("active", false);
		}
		
		$scope.isTopicListVisible = !$scope.isTopicListVisible;
	};
	
	$scope.filterOnTopic = function(topicId)
	{
		if ($scope.activeTopicId == null || $scope.activeTopicId == topicId)
		{
			HighlightService.setPersistent(!HighlightService.isPersistent());
			d3.selectAll(".menu-element-text").filter(".topic").filter(".t" + topicId).classed("active", HighlightService.isPersistent());
			if (!HighlightService.isPersistent()) $scope.activeTopicId = null;
			else $scope.activeTopicId = topicId;
		}
	};
	
	
	$scope.$watch(
		function() {return HighlightService.getTopicId();}, 
		function (newValue, oldValue) 
		{
			if (!HighlightService.isPersistent())
			{
				if (newValue) 
				{
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
			}
		}, true);
	
}]);