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
			d3.selectAll(".view").classed("active", false);
			d3.selectAll(".view").filter(".when").classed("active", true);
			d3.selectAll(".data").classed("active", false);
			d3.selectAll(".data").filter("." + $routeParams.dataType).classed("active", true);
			d3.select(".header").style("height", "30px");
			
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
			
			scope.$watch(
					function() {return DataService.hasData();}, 
					function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
			
			scope.$watch(
					function() {return HighlightService.getPersonId();}, 
					function (newValue, oldValue) 
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
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getTopicId();}, 
					function (newValue, oldValue) 
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
			    	.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")");

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
			                
			                var composedClass = "";
			                for (var j = 0; j < letter.authors.length; j++) composedClass += " p" + letter.authors[j].id;
			                
			                chartArea.append("rect")
			                    .attr("class", "letter l" + letter.id + " t" + letter.chapterId + composedClass)
			                	.attr("person-id", letter.authors[0].id)
			                    .attr("letter-id", letter.id)
			                    .attr("width", CanvasService.getXscale().rangeBand())
			                    .attr("y", CanvasService.getYoffset(maxColumnHeight - i))
			                    .attr("transform", "translate(" + CanvasService.getXoffset(letter.accuratYear) + ",0)")
			                    .attr("height", CanvasService.getYoffset(1))
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .on("click", function(d)
			                    {
			                    	var url = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWho);
			                    	url = LocationService.setUrlParameter(SymbolsService.urlTokenPerson, d3.select(this).attr("person-id"));
			                    	window.location = url;
			                    })
			                    .on("mouseover", function(d)
			                    {
			                    	var element = d3.select(this);
									scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
									scope.$apply(function() {HighlightService.setPersonHoverId(element.attr("person-id"));});
			                    })
			                    .on("mouseout", function(d)
			                    {
									scope.$apply(function() {HighlightService.setLetterHoverId(null);});
									scope.$apply(function() {HighlightService.setPersonHoverId(null);});
			                    });
			            }
			        }
			    });
			};
		}
	};
}]);