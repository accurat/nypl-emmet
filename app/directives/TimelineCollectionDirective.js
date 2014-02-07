emmetApp.directive('timelinecollection', ['DataService', 'TimeService', 'CanvasService', 'ColorService', 'SymbolsService', 'LocationService', '$routeParams', 'HighlightService', function(DataService, TimeService, CanvasService, ColorService, SymbolsService, LocationService, $routeParams, HighlightService)
{
	return {
		restrict: 'E',
		replace: true,
		scope: 
		{
			
		},
		template: 
			'<div class="timeline-collection"></div>',
		link: function(scope, element, attrs)
		{
			scope.X_AXIS_HEIGHT = 40;
			
			scope.X_AXIS_FONT_FAMILY = "'Gentium Basic', serif";
			scope.X_AXIS_FONT_WEIGHT = "500";
			scope.X_AXIS_FONT_SIZE = "10px";
			
			// vertical text
			/*scope.X_AXIS_FONT_ORIENTATION = "rotate(-90)";
			scope.X_AXIS_LABEL_OFFSET_HORIZONTAL = "-20";
			scope.X_AXIS_LABEL_OFFSET_VERTICAL = "-5";*/
			
			//horizontal text
			scope.X_AXIS_FONT_ORIENTATION = "";
			scope.X_AXIS_LABEL_OFFSET_HORIZONTAL = "";
			scope.X_AXIS_LABEL_OFFSET_VERTICAL = "10";
			
			scope.LETTER_STROKE_COLOR = "#F5EEDF";
			scope.LETTER_STROKE_WIDTH = "1px";
			
			scope.$watch(
					function() {return DataService.hasData();}, 
					function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
			
			scope.$watch(
					function() {return HighlightService.getData();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							if (newValue.personId != null)
							{
								d3.selectAll("rect")
		                            .style("fill-opacity", function(d)
		                            {
		                                if(newValue.personId == d3.select(this).attr("author_id")) return 1;
		                                else return 0.1;
		                            });
							}
							else d3.selectAll("rect").style("fill-opacity", 1);
						}
					}, true);
			
			
			scope.draw = function() 
			{
				var orderType = $routeParams.orderType;
				if (!orderType) orderType = SymbolsService.orderTopic;
				
				var dataTimelineColletion = DataService.getData($routeParams.dataType, SymbolsService.dataTimelineCollection, null);
				
			    var xAxis = d3.svg.axis()
			        .scale(CanvasService.getXscale())
			        .orient("bottom");

			    var maxColumnHeight = d3.max(dataTimelineColletion.lettersCountByYear, function(d) { return d; });
			    
			    CanvasService.getYscale()
			    	.domain([0, maxColumnHeight])
			    	.range([0, (CanvasService.getHeight() - scope.X_AXIS_HEIGHT)]);
			    
			    d3.select("svg").remove();
			    
			    var svg = d3.select(".timeline-collection").append("svg")
			        .attr("class", "viewer")
			        .attr("width", CanvasService.getAvailableWidth())
			        .attr("height", CanvasService.getAvailableHeight());
			    
			    var chartArea = svg.append("g")
			    	.attr("class", "chartArea")
			    	.attr("transform", "translate(" + CanvasService.getMargin().left + "," + CanvasService.getMargin().top + ")");

			    svg.append("g")
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

			    d3.selectAll("rect").remove();
			   
			    DataService.sortLetters(dataTimelineColletion.lettersByYear, orderType);
			    
			    dataTimelineColletion.lettersByYear.forEach(function(year)
			    {
			        var yearNum = year[0].accuratYear;
			        if(TimeService.isYearInTimeline(yearNum))
			        {
			            for (var i = 0; i < year.length; i++)
			            {
			                var letter = year[i];
			                chartArea.append("rect")
			                    .attr("author_id", letter.authors[0].id)
			                    .attr("letter_id", letter.id)
			                    .attr("width", CanvasService.getXscale().rangeBand())
			                    .attr("y", CanvasService.getYoffset(maxColumnHeight - i))
			                    .attr("transform", "translate(" + CanvasService.getXoffset(letter.accuratYear) + ",0)")
			                    .attr("height", CanvasService.getYoffset(1))
			                    .attr("cursor", "pointer")
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .style("stroke-width", scope.LETTER_STROKE_WIDTH)
			                    .style("stroke", scope.LETTER_STROKE_COLOR)
			                    .on("click", function(d)
			                    {
			                    	var url = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWho);
			                    	url = LocationService.setUrlParameter(SymbolsService.urlTokenPerson, d3.select(this).attr("author_id"));
			                    	window.location = url;
			                    })
			                    .on("mouseover", function(d)
			                    {
			                    	//tooltip.displayHtml(template(dataGeneral.lettersById[d3.select(this).attr("letter_id")]));
			                    	
			                        var authorId = d3.select(this).attr("author_id");
			                        d3.selectAll("rect")
			                            .style("fill-opacity", function(d)
			                            {
			                                if(authorId == d3.select(this).attr("author_id")) return 1;
			                                else return 0.1;
			                            });
			                    })
			                    .on("mousemove", function(d)
			                    {
			                        //tooltip.refresh(d3.event.pageX, d3.event.pageY);
			                    })
			                    .on("mouseout", function(d)
			                    {
			                        //tooltip.close();	
			                        d3.selectAll("rect").style("fill-opacity", 1);
			                    });
			            }
			        }
			    });
			};
		}
	};
}]);