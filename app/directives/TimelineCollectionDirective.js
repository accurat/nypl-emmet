emmetApp.directive('timelinecollection', [
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
		controller: 'TimelineCollectionController',
		templateUrl: 'app/templates/TimelineCollection.tpl.html',
		link: function(scope, element, attrs)
		{
			d3.selectAll(".menu-item").filter(".view").classed("active", false);
			d3.selectAll(".menu-item").filter(".view").filter(".view-when").classed("active", true);
			
			d3.selectAll(".menu-element").filter(".orderby").classed("active", false);
			d3.selectAll(".menu-element").filter(".orderby").filter(".orderby-" + $routeParams.orderType).classed("active", true);
			
			scope.X_AXIS_HEIGHT = 40;
			scope.X_AXIS_FONT_FAMILY = "'Gentium Basic', serif";
			scope.X_AXIS_FONT_WEIGHT = "500";
			scope.X_AXIS_FONT_SIZE = "10px";
			scope.X_AXIS_FONT_ORIENTATION = "";
			scope.X_AXIS_LABEL_OFFSET_HORIZONTAL = "";
			scope.X_AXIS_LABEL_OFFSET_VERTICAL = "10";
			
			scope.$watch(
					function() {return DataService.hasData();}, 
					function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
			
			scope.$watch(
					function() {return HighlightService.getPersonId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent())
						{
							if (newValue) 
							{
								d3.selectAll(".letter").classed("opacized", true);
								d3.selectAll(".letter").filter(".p" + newValue).classed("opacized", false);
							}	
							else
							{
								d3.selectAll(".letter").classed("opacized", false);
							}
						}
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getTopicId();}, 
					function (newValue, oldValue) 
					{
						if (!HighlightService.isPersistent())
						{
							if (newValue) 
							{
								d3.selectAll(".letter").classed("opacized", true);
								d3.selectAll(".letter").filter(".t" + newValue).classed("opacized", false);
							}	
							else
							{
								d3.selectAll(".letter").classed("opacized", false);
							}
						}
					}, true);
			
			scope.draw = function() 
			{
				CanvasService.initOnContainer('viewer-contents');
				HighlightService.setPersistent(false);
				
				
				var orderType = $routeParams.orderType;
				if (!orderType) orderType = SymbolsService.orderTopic;
				
				var dataTimelineColletion = DataService.getData($routeParams.dataType, SymbolsService.dataTimelineCollection, null);
				
				var xScale = d3.scale.ordinal()
		    		.rangeBands([0, CanvasService.getWidth()], .65)
		    		.domain(TimeService.getYears());
				
			    var xAxis = d3.svg.axis()
			        .scale(xScale)
			        .orient("bottom");

			    var maxColumnHeight = d3.max(dataTimelineColletion.lettersCountByYear, function(d) { return d; });
			    
			    var yScale = d3.scale.linear()
		    		.domain([0, maxColumnHeight])
			    	.range([0, (CanvasService.getHeight() - scope.X_AXIS_HEIGHT)]);
			    
			    var defaultHeight = yScale(1);
            	var defaultWidth = xScale.rangeBand();
			    
			    d3.select("svg").remove();
			    
			    var svg = d3.select(".timeline-collection").append("svg")
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
	                		
	                		scope.$apply(function() {HighlightService.setLetterHoverId(null);});
							scope.$apply(function() {HighlightService.setPersonHoverId(null);});
	                		
	                		var element = d3.selectAll("rect").filter(".magnified");
							element.attr("height", defaultHeight);
							element.attr("width", defaultWidth);
							element.classed("magnified", false);
							
							var yearNum = element.attr("letter-year");
							d3.selectAll("rect").filter(".letter").filter(".y" + yearNum).attr("transform", "");
	                	}
	                });
			    
			    var chartArea = svg.append("g")
			    	.attr("class", "chartArea")
			    	.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")");
			    
			    var chartAxis = svg.append("g")
			        .attr("class", "xAxis")
			        .attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top + CanvasService.getHeight() - scope.X_AXIS_HEIGHT) + ")")
			        .call(xAxis)
			        .selectAll("text")
			        .attr("dx", scope.X_AXIS_LABEL_OFFSET_HORIZONTAL)
			        .attr("dy", scope.X_AXIS_LABEL_OFFSET_VERTICAL)
			        .style("font-size", scope.X_AXIS_FONT_SIZE)
			        .style("font-weight", scope.X_AXIS_FONT_WEIGHT)
			        .style("font-family", scope.X_AXIS_FONT_FAMILY)
			        .attr("transform", scope.X_AXIS_FONT_ORIENTATION);

			    d3.selectAll("rect").filter(".letter").remove();
			   
			    DataService.sortLetters(dataTimelineColletion.lettersByYear, orderType);
			    
			    dataTimelineColletion.lettersByYear.forEach(function(year)
			    {
			        var yearNum = year[0].accuratYear;
			        if(TimeService.isYearInTimeline(yearNum))
			        {
			            for (var i = 0; i < year.length; i++)
			            {
			                var letter = year[i];
			                
			                var composedClass = "";
			                for (var j = 0; j < letter.authors.length; j++) composedClass += " p" + letter.authors[j].id;
			                
			                chartArea.append("rect")
			                    .attr("class", "letter l" + letter.id + " t" + letter.chapterId + composedClass + " y" + yearNum)
			                	.attr("person-id", letter.authors[0].id)
			                    .attr("letter-id", letter.id)
			                    .attr("letter-year", yearNum)
			                    .attr("letter-topic", letter.chapterId)
			                    .attr("width", defaultWidth)
			                    .attr("height", defaultHeight)
			                    .attr("y", yScale(maxColumnHeight - i))
			                    .attr("x", xScale(letter.accuratYear))
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .on("click", function(d)
			                    {
			                    	var element = d3.select(this);
			                    	scope.$apply(function() {PopupService.setPersistent(true);});
			                    })
			                    .on("mouseover", function(d)
			                    {
			                    	if (!PopupService.isPersistent())
			                    	{
				                    	var element = d3.select(this);
				                    	
				                    	if (!HighlightService.isPersistent() || (HighlightService.isPersistent() && HighlightService.getTopicId() == element.attr("letter-topic")))
				                    	{
					                    	scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
											scope.$apply(function() {HighlightService.setPersonHoverId(element.attr("person-id"));});
											
											element.classed("magnified", true);
											element.attr("height", 3*defaultHeight);
											element.attr("width", 2*defaultWidth);
											element.attr("transform", "translate(" + (-defaultWidth / 2) + "," + (-(defaultHeight*3 - defaultHeight)) + ")");
											
											var ry = element.attr("y");
											d3.selectAll("rect").filter(".letter").filter(".y" + yearNum).each(function(d)
											{
												var otherRect = d3.select(this);
												if (parseFloat(otherRect.attr("y")) < ry) otherRect.attr("transform", "translate(0," + (-(defaultHeight*3 - defaultHeight)) + ")");
											});
				                    	}
			                    	}
			                    })
			                    .on("mouseout", function(d)
			                    {
									if (!PopupService.isPersistent())
									{
				                    	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
										scope.$apply(function() {HighlightService.setPersonHoverId(null);});
										
										var element = d3.select(this);
										element.classed("magnified", false);
										element.attr("height", defaultHeight);
										element.attr("width", defaultWidth);
										d3.selectAll("rect").filter(".letter").filter(".y" + yearNum).attr("transform", "");
									}
			                    });
			            }
			        }
			    });
			};
		}
	};
}]);