emmetApp.directive('placecollection', [
'DataService', 
'TimeService', 
'CanvasService', 
'ColorService', 
'SymbolsService', 
'LocationService', 
'$routeParams', 
'HighlightService', 
'PopupService', 
function(
	DataService, 
	TimeService, 
	CanvasService, 
	ColorService, 
	SymbolsService, 
	LocationService, 
	$routeParams, 
	HighlightService, 
	PopupService) 
{
	return {
		restrict: 'E',
		replace: true,
		scope: 
		{
			
		},
		controller: 'PlaceCollectionController',
		templateUrl: 'app/templates/PlaceCollection.tpl.html',
		link: function(scope, element, attrs)
		{
			d3.selectAll(".menu-item").filter(".view").classed("active", false);
			d3.selectAll(".menu-item").filter(".view").filter(".view-where").classed("active", true);
			
			scope.$watch(
					function() {return DataService.hasData();}, 
					function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
			
			scope.$watch(
					function() {return HighlightService.getTopicId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent() && !PopupService.isPersistent())
						{
							if (newValue) 
							{
								// TODO
							}	
							else
							{
								// TODO
							}
						}
					}, true);
			
			scope.draw = function() 
			{
				CanvasService.initOnContainer('viewer-contents');
				HighlightService.reset();
				PopupService.reset();
				
				d3.select("svg").remove();
			    
			    var svg = d3.select(".place-collection").append("svg")
			        .attr("class", "viewer")
			        .attr("width", CanvasService.getWidth())
			        .attr("height", CanvasService.getHeight());
			      
			    var chartBackground = svg.append("g")
			    	.attr("class", "chartBackground");
			    
			    chartBackground.append("rect")
			    	.attr("class", "background")
			    	.attr("width", CanvasService.getWidth())
			        .attr("height", CanvasService.getHeight())
	                .attr("y", 0)
	                .attr("x", 0)
	                .style("fill", ColorService.getColorFor("pageBackground"))
	                .attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")")
	                .on("click", function() 
	                {
	                	if (PopupService.isVisible() && PopupService.isPersistent())
	                	{
	                		PopupService.setPersistent(false);
	                		PopupService.hidePopup();
	                		
	                		//scope.$apply(function() {HighlightService.setLetterHoverId(null);}); //TODO
	                	}
	                });
			    
			    scope.chartArea = svg.append("g")
		    		.attr("class", "chartArea")
		    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")");
			    
			    var whereType = $routeParams.whereType;
			    if (whereType == SymbolsService.mapSnake) scope.drawMapSnake();
			    else scope.drawMapContemporary();
			    
			};
			
			scope.drawMapSnake = function()
			{
				scope.chartArea.append("image")
				    .attr("xlink:href","img/snake.svg")
				    .attr("width", 415)
				    .attr("height", 464);
			};
			
			scope.drawMapContemporary = function()
			{
				
			};
		}
	};
}]);