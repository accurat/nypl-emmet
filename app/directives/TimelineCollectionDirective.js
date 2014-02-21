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
			d3.selectAll(".orderby").classed("active", false);
			d3.selectAll(".orderby").filter("." + $routeParams.orderType).classed("active", true);
			
			d3.select(".header").style("height", "5px");
			
			scope.X_AXIS_HEIGHT = 40;
			
			
			
			scope.X_AXIS_FONT_FAMILY = "'Gentium Basic', serif";
			scope.X_AXIS_FONT_WEIGHT = "500";
			scope.X_AXIS_FONT_SIZE = "10px";
			
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
				d3.select(".order-by-container")
					.style("visibility", "visible")
					.style("bottom", CanvasService.getAvailableHeight() - (CanvasService.getMargin().top + CanvasService.getHeight() - scope.X_AXIS_HEIGHT) + "px");
				
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
			    
			    var defaultHeight = yScale(1);
            	var defaultWidth = xScale.rangeBand();
			    
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
			                    .attr("width", defaultWidth)
			                    .attr("height", defaultHeight)
			                    .attr("y", yScale(maxColumnHeight - i))
			                    .attr("x", xScale(letter.accuratYear))
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
									
									element.attr("height", 3*defaultHeight);
									element.attr("width", 2*defaultWidth);
									element.attr("transform", "translate(" + (-defaultWidth / 2) + "," + (-(defaultHeight*3 - defaultHeight)) + ")");
									
									var ry = element.attr("y");
									d3.selectAll("rect").filter(".y" + yearNum).each(function(d)
									{
										var otherRect = d3.select(this);
										if (parseFloat(otherRect.attr("y")) < ry) otherRect.attr("transform", "translate(0," + (-(defaultHeight*3 - defaultHeight)) + ")");
									});
									
			                    })
			                    .on("mouseout", function(d)
			                    {
									scope.$apply(function() {HighlightService.setLetterHoverId(null);});
									scope.$apply(function() {HighlightService.setPersonHoverId(null);});
									
									var element = d3.select(this);
									element.attr("height", defaultHeight);
									element.attr("width", defaultWidth);
									d3.selectAll("rect").attr("transform", "");
			                    });
			                    
			            }
			        }
			    });
			    
			    
			    /*================================================================*/
			    /* MAGNIFICATION EFFECT - FISHEYE-LIKE
			    /*================================================================*/
			    /*var rects = d3.selectAll("rect");
				var coordinates = [0, 0];
				
				var defaultWidth = xScale.rangeBand();
				var defaultHeight = yScale(1);
				var radius = 50;
				var xMag = 2;
				var yMag = 1;
				
				
				
				svg.on("mousemove", function() 
				{
					coordinates = d3.mouse(this);
				    var mx = coordinates[0] - CanvasService.getMargin().left;
				    var my = coordinates[1] - CanvasService.getMargin().top;
				    rects.each(function(d) 
				    {
				    	var r = d3.select(this);
				    	var rx = parseInt(r.attr("x"));
				    	var ry = parseInt(r.attr("y"));
				    	var d = Math.sqrt((mx-rx)*(mx-rx) + (my-ry)*(my-ry));
				    	if (d <= radius)
				    	{
				    		r.attr("width", function(d) 
		    				{
		    					var dim = parseFloat(r.attr("width"));
		    					if (dim > defaultWidth) return dim;
		    					else return dim * xMag;
		    				});
					    	r.attr("height", function(d) 
			    			{
					    		var dim = parseFloat(r.attr("height"));
								if (dim > defaultHeight) return dim;
								else return dim * yMag;
			    			});
					    	r.attr("transform", function (d)
					    	{
					    		return "translate(" + (-defaultWidth / 2) + ",0)";
					    	});
				    	}
				    	else
				    	{
				    		r.attr("width", defaultWidth);
					    	r.attr("height", defaultHeight);
					    	r.attr("transform", "");
				    	}
				    });
				  });*/
			    
			    
			    /*================================================================*/
			    /* MAGNIFICATION EFFECT - EXPANDING RECTANGLES
			    /*================================================================*/
			    //var rects = d3.selectAll("rect");
				/*var coordinates = [0, 0];
				
				var defaultWidth = xScale.rangeBand();
				var defaultHeight = yScale(1);
				var radius = 50;
				var xMag = 2;
				var yMag = 1;
				
				var currentPointingYear;
				
				svg.on("mousemove", function() 
				{
					coordinates = d3.mouse(this);
				    var mx = coordinates[0] - CanvasService.getMargin().left;
				    var my = coordinates[1] - CanvasService.getMargin().top;
				    
				    var leftEdges = xScale.range();
			        var width = xScale.rangeBand();
			        var j;
			        for(j = 0; mx > (leftEdges[j] + width); j++) {}
			        
			        var year = xScale.domain()[j];
			        
			        
			        d3.selectAll("rect")
			        	.attr("width", defaultWidth)
			        	.attr("height", defaultHeight)
			        	.attr("transform", "");
			        
			        var rects = d3.selectAll("rect").filter(".y" + year).each(function(d) 
			        {
			        	var r = d3.select(this);
			        	var rx = parseInt(r.attr("x"));
				    	var ry = parseInt(r.attr("y"));
			        	
				    	
				    	if (ry <= my)
				    	{
				    		
				    		if (((mx >= rx && mx<=(rx+defaultWidth)) && (my>=ry && my <= (ry+defaultHeight))))
				    		{
				    			//r.attr("width", 2*defaultWidth);
				    			r.attr("height", 3*defaultHeight);
					        	r.attr("transform", "translate(0," + (-(defaultHeight*3 - defaultHeight)) + ")");
					        	//r.attr("transform", "translate(" + (-defaultWidth / 2) + "," + (-(defaultHeight*3 - defaultHeight)) + ")");
				    		}
				    		else if (mx >= rx && mx<=(rx+defaultWidth))
				    		{
				    			//r.attr("width", 2*defaultWidth);
				    			r.attr("height", defaultHeight);
					        	r.attr("transform", "translate(0," + (-(defaultHeight*3 - defaultHeight)) + ")");
				    			
				    		}
				    	}
			        });
			        
			        
			        
				    /*
				    rects.each(function(d) 
				    {
				    	var r = d3.select(this);
				    	var rx = parseInt(r.attr("x"));
				    	var ry = parseInt(r.attr("y"));
				    	var d = Math.sqrt((mx-rx)*(mx-rx) + (my-ry)*(my-ry));
				    	if (d <= radius)
				    	{
				    		r.attr("width", function(d) 
		    				{
		    					var dim = parseFloat(r.attr("width"));
		    					if (dim > defaultWidth) return dim;
		    					else return dim * xMag;
		    				});
					    	r.attr("height", function(d) 
			    			{
					    		var dim = parseFloat(r.attr("height"));
								if (dim > defaultHeight) return dim;
								else return dim * yMag;
			    			});
					    	r.attr("transform", function (d)
					    	{
					    		return "translate(" + (-defaultWidth / 2) + ",0)";
					    	});
				    	}
				    	else
				    	{
				    		r.attr("width", defaultWidth);
					    	r.attr("height", defaultHeight);
					    	r.attr("transform", "");
				    	}
				    });*/
				  //});
			};
		}
	};
}]);