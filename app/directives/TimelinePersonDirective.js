emmetApp.directive('timelineperson', ['DataService', 'TimeService', 'CanvasService', 'ColorService', 'SymbolsService', 'LocationService', '$routeParams', 'HighlightService', function(DataService, TimeService, CanvasService, ColorService, SymbolsService, LocationService, $routeParams, HighlightService)
{
	return {
		restrict: 'E',
		replace: true,
		scope: 
		{
			
		},
		template: 
			'<div class="timeline-person"></div>',
		link: function(scope, element, attrs)
		{
			// *************************************************************************
			// CONFIGURATION CONSTANTS 
			// *************************************************************************
			scope.X_AXIS_HEIGHT = 13;
			scope.X_AXIS_FONT_FAMILY = "'Gentium Basic', serif";
			scope.X_AXIS_FONT_WEIGHT = "500";
			scope.X_AXIS_FONT_SIZE = "10px";
			
			scope.HORIZONTAL_SLICE_HEIGHT = 15;
			scope.HORIZONTAL_SLICE_HEIGHT_MULTI = 8;
			
			scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES = 20;
			scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE = 20;
			scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES = 20;
			scope.DISTANCE_PERSON_NAME_TO_FIRST_LETTER = 20;
			
			scope.VERTICAL_LINES_DASHARRAY_AUTHOR = "";
			scope.VERTICAL_LINES_DASHARRAY_RECIPIENT = "3,2";
			scope.VERTICAL_LINES_OFFSET_AUTHOR = -2;
			scope.VERTICAL_LINES_OFFSET_RECIPIENT = 6;
			scope.VERTICAL_LINES_OFFSET_VERTICAL = -3;
				
			scope.HORIZONTAL_LINES_OFFSET_AUTHOR = -3;
			scope.HORIZONTAL_LINES_OFFSET_RECIPIENT = 3;
			scope.HORIZONTAL_LINES_OFFSET_VERTICAL = -5;
				
			scope.RECT_OFFSET_AUTHOR = -5;
			scope.RECT_OFFSET_RECIPIENT = 3;
			scope.RECT_OFFSET_VERTICAL = -8;
			scope.RECT_WIDTH = 6;
			scope.RECT_HEIGHT = 6;
			
			scope.PLACEMARK_COLOR = "#FFFFFF";
			scope.PLACEMARK_STROKE_COLOR = "#000000";
			scope.PLACEMARK_STROKE_WIDTH = "1px";
			scope.PLACEMARK_HEIGHT = scope.RECT_HEIGHT;
			scope.PLACEMARK_WIDTH_SINGLE = scope.RECT_WIDTH;
			scope.PLACEMARK_WIDTH_MULTI = 2*scope.RECT_WIDTH + 2;
			scope.PLACEMARK_OFFSET_AUTHOR = scope.RECT_OFFSET_AUTHOR;
			scope.PLACEMARK_OFFSET_RECIPIENT = scope.RECT_OFFSET_RECIPIENT;
			scope.PLACEMARK_OFFSET_VERTICAL = scope.RECT_OFFSET_VERTICAL;
			
			scope.TIMELINE_EXTENSION_HEIGHT = 150;
			
			
			// *************************************************************************
			// DRAWN ELEMENTS DUMMY VARIABLES
			// *************************************************************************
			scope.processedLetterIds = new Array();
			scope.processedRecipientIds = new Array();
			
		    scope.drawnLettersByRecipient = new Array();
			scope.drawnRecipientsByContainer = new Array();
			scope.drawnBezierCurvesAuthorByYear = new Array();
		    scope.drawnBezierCurvesRecipientByYear = new Array();
		    scope.drawnRecipientNames = new Array();
			scope.drawnVerticalLinesAuthorByYear = new Array();
		    scope.drawnVerticalLinesRecipientByYear = new Array();
			scope.drawnHorizontalLinesByRecipient = new Array();
		   
			// *************************************************************************
			// TIMELINE EXPANSION MGMT
			// *************************************************************************
			scope.isTimelineExpandedForRecipient = new Array();
			scope.baseViewerHeight = 0;
			scope.recipientContainerCount = 0;
			
		    // *************************************************************************
			// WATCH LISTENERS
			// *************************************************************************
			
		    scope.$watch(
					function() {return DataService.hasData();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							scope.draw($routeParams.personId);
						}
					}, true);
			
		    
		    scope.$watch(
					function() {return HighlightService.getPersonId();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							d3.selectAll(".person-name-token").filter(".p" + newValue).classed("highlighted", true);
							d3.selectAll(".bezier-curve").filter(".p" + newValue).classed("highlighted", true);
							d3.selectAll(".horizontal-line").filter(".p" + newValue).classed({'highlighted': true, 'hidden': false});
	                        d3.selectAll(".vertical-line").filter(".p" + newValue).classed({'highlighted': true, 'hidden': false});
						}
						else
						{
							d3.selectAll(".person-name-token").classed("highlighted", false);
							d3.selectAll(".bezier-curve").classed("highlighted", false);
							d3.selectAll(".horizontal-line").classed({'highlighted': false, 'hidden': true});
							d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
							d3.selectAll(".vertical-line").classed({'highlighted': false, 'hidden': true});
							d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
						}
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getLetterId();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							d3.selectAll(".person-name-token").filter(".l" + newValue).classed("highlighted", true);
							d3.selectAll(".horizontal-line").filter(".l" + newValue).classed({'highlighted': true, 'hidden': false});
							d3.selectAll(".vertical-line").filter(".l" + newValue).classed({'highlighted': true, 'hidden': false});
							d3.selectAll(".bezier-curve").filter(".l" + newValue).classed("highlighted", true);
						}	
						else
						{
							d3.selectAll(".person-name-token").classed("highlighted", false);
							d3.selectAll(".horizontal-line").classed({'highlighted': false, 'hidden': true});
							d3.selectAll(".horizontal-line").filter("#static").classed("hidden", false);
							d3.selectAll(".vertical-line").classed({'highlighted': false, 'hidden': true});
							d3.selectAll(".vertical-line").filter("#static").classed("hidden", false);
							d3.selectAll(".bezier-curve").classed("highlighted", false);
							
						}
					}, true);
			
			
			
			
			// *************************************************************************
			// METHODS
			// *************************************************************************
			
			scope.draw = function(personId) 
			{
				var dataTimelinePerson = DataService.getData($routeParams.dataType, SymbolsService.dataTimelineAuthor, personId);
				var maximumSlicesHeight = dataTimelinePerson.lettersByRecipientArray.length * scope.HORIZONTAL_SLICE_HEIGHT;
			    var maximumViewerHeight = CanvasService.getMargin().top + CanvasService.getMargin().bottom + CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + maximumSlicesHeight;
				scope.baseViewerHeight = maximumViewerHeight;
			    
				scope.initializeDummyVariables(dataTimelinePerson);
				
				var svg = d3.select(".timeline-person").append("svg")
		        	.attr("class", "viewer")
		        	.attr("width", CanvasService.getAvailableWidth())
		        	.attr("height", maximumViewerHeight);
			    
				var xAxis = d3.svg.axis()
		        	.scale(CanvasService.getXscale())
		        	.orient("bottom");
				
			    var chartArea = svg.append("g")
		    		.attr("class", "chartArea")
		    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + CanvasService.getMargin().top + ")");
		    
			    svg.append("g")
			        .attr("class", "xAxis")
			        .attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getHeight()/3 - (scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE + scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES - scope.X_AXIS_HEIGHT)/2) + ")")
			        .call(xAxis)
			        .selectAll("text")
			        .style("font-size", scope.X_AXIS_FONT_SIZE)
			        .style("font-weight", scope.X_AXIS_FONT_WEIGHT)
			        .style("font-family", scope.X_AXIS_FONT_FAMILY);
			    
			    var curvesContainer = svg.append("g")
			    	.attr("id", "curves-container")
			    	.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getHeight()/6 + scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES) + ")");
			    
			    var verticalLinesContainer = chartArea.append("g")
			    	.attr("id", "vertical-lines-container");
			    
			    var horizontalLinesContainer = chartArea.append("g")
			    	.attr("id", "horizontal-lines-container");
			    
			    svg.append("text")
			    	.text(DataService.getPersonById($routeParams.dataType, personId).name)
			    	.attr("class", "author-name")
			    	.attr("text-anchor", "middle")
			    	.attr("transform", "translate(" + (CanvasService.getWidth()/2 + CanvasService.getMargin().left)  + "," + (CanvasService.getHeight()/6) + ")");
			    
			    var years = TimeService.getYears();
			    for (var yearIndex = 0; yearIndex < years.length; yearIndex++)
			    {
			    	var year = years[yearIndex];
			    	scope.recipientContainerCount = dataTimelinePerson.lettersByRecipientArray.length;
			    	for (var sliceIndex = 0; sliceIndex < dataTimelinePerson.lettersByRecipientArray.length; sliceIndex++)
			    	{
			    		var sliceLetters = dataTimelinePerson.lettersByRecipientArray[sliceIndex];
			    		if (!scope.hasProcessedRecipient(sliceIndex) && scope.sliceHasLettersInYear(sliceLetters, year))
			    		{
			    			var recipientContainer = scope.drawRecipientContainer(chartArea, sliceIndex, sliceLetters, personId);
			    			var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
				    		var sliceClass = scope.drawName(recipientContainer, sliceOffset, sliceLetters[0], DataService.isPersonAuthorById(personId, sliceLetters[0]), sliceIndex, sliceLetters);
				    		
				    		scope.processedRecipientIds.push(sliceIndex);
				    		scope.drawHorizontalLine(horizontalLinesContainer, sliceOffset, personId, sliceLetters, sliceIndex, sliceClass);
			    			
				    		for (var letterIndex = 0; letterIndex < sliceLetters.length; letterIndex++)
				    		{
				    			var letter = sliceLetters[letterIndex];
				    			if (!scope.hasProcessedLetter(letter.id))
				    			{
				    				var isPersonAuthor = DataService.isPersonAuthorById(personId, letter);
					    			scope.processedLetterIds.push(letter.id);
					    			scope.drawBezierCurve(curvesContainer, letter, isPersonAuthor);
					    			scope.drawVerticalLine(verticalLinesContainer, sliceOffset, letter, isPersonAuthor, personId, sliceIndex);
					    			
				    			}
				    		}
				    		
				    		scope.drawLetters(recipientContainer, sliceIndex, sliceOffset, sliceLetters, personId);
				    		
			    		}
			    	}
			    }
			};
			
			scope.initializeDummyVariables = function(dataTimelinePerson)
			{
				var years = TimeService.getYears();
			    for (var year in years)
			    {
			    	scope.drawnBezierCurvesAuthorByYear[year] = false;
				    scope.drawnBezierCurvesRecipientByYear[year] = false;
				    
				    scope.drawnVerticalLinesAuthorByYear[year] = null;
				    scope.drawnVerticalLinesRecipientByYear[year] = null;
			    }
			    
			    for (var recipientIndex = 0; recipientIndex < dataTimelinePerson.lettersByRecipientArray.length; recipientIndex++)
			    {
			    	scope.drawnRecipientsByContainer[recipientIndex] = null;
			    	scope.drawnLettersByRecipient[recipientIndex] = false;
			    	scope.drawnRecipientNames[recipientIndex] = false;
			    	scope.drawnHorizontalLinesByRecipient[recipientIndex] = null;
			    	scope.isTimelineExpandedForRecipient[recipientIndex] = false;
			    }
			};
			
			scope.drawLetters = function(recipientContainer, sliceIndex, sliceOffset, sliceLetters, personId)
			{
				if (!scope.drawnLettersByRecipient[sliceIndex])
				{
					scope.drawnLettersByRecipient[sliceIndex] = true;
					
					var sliceLettersByYear = new Array();
					for (var i = 0; i < sliceLetters.length; i++)
					{
						if (!sliceLettersByYear[sliceLetters[i].accuratYear]) sliceLettersByYear[sliceLetters[i].accuratYear] = new Array();
						sliceLettersByYear[sliceLetters[i].accuratYear].push(sliceLetters[i]);
					}
					
					for (var i in sliceLettersByYear)
					{
						var yearLetters = sliceLettersByYear[i];
						if (yearLetters.length == 1) scope.drawRectangle(recipientContainer, sliceOffset, yearLetters[0], DataService.isPersonAuthorById(personId, yearLetters[0]));
						else scope.drawPlacemark(recipientContainer, sliceOffset, yearLetters, personId, sliceIndex);
					}
				}				
			};
			
			scope.drawPlacemark = function(recipientContainer, sliceOffset, yearLetters, personId, sliceIndex)
			{
				var isAuthor = false;
				for (var i = 0; i < yearLetters.length; i++)
				{
					if (DataService.isPersonAuthorById(personId, yearLetters[i]))
					{
						isAuthor = true;
						break;
					}
				}
				
				var isRecipient = false;
				for (var i = 0; i < yearLetters.length; i++)
				{
					if (DataService.isPersonRecipientById(personId, yearLetters[i]))
					{
						isRecipient = true;
						break;
					}
				}
				
				var placemarkType = 0;
				if (!isAuthor && isRecipient) placemarkType = 1;
				else if (isAuthor && isRecipient) placemarkType = 2; 
				
				var placemarkOffsetActual;
				var placemarkWidthActual;
				
				if (placemarkType == 0)
				{
					// author is only author
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_AUTHOR;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_SINGLE;
				}
				else if (placemarkType == 1)
				{
					// author is only recipient
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_RECIPIENT;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_SINGLE;
				}
				else
				{
					// author is both
					placemarkOffsetActual = scope.PLACEMARK_OFFSET_AUTHOR;
					placemarkWidthActual = scope.PLACEMARK_WIDTH_MULTI;
				}
				
				recipientContainer.append("rect")
                   	.attr("class", "placemark")
                   	.attr("recipient-container-id", sliceIndex)
					.style("fill", scope.PLACEMARK_COLOR)
            	   	.style("stroke", scope.PLACEMARK_STROKE_COLOR)
            	   	.style("stroke-width", scope.PLACEMARK_STROKE_WIDTH)
        	   		.attr("cursor", "pointer")
            	   	.attr("transform", "translate(" + (CanvasService.getXoffset(yearLetters[0].accuratYear) + placemarkOffsetActual)  + "," + scope.PLACEMARK_OFFSET_VERTICAL + ")")
        	   		.attr("width", placemarkWidthActual)
        	   		.attr("height", scope.PLACEMARK_HEIGHT)
        	   		.on("click", function(d)
	                {
						scope.displayNestedTimeline(parseInt(d3.select(this).attr("recipient-container-id")), sliceOffset, yearLetters, personId, placemarkType);
	                });
            	
			};
			
			scope.displayNestedTimeline = function(selectedSliceIndex, sliceOffset, yearLetters, personId, placemarkType)
			{
				if (!scope.isTimelineExpandedForRecipient[selectedSliceIndex])
				{
					scope.isTimelineExpandedForRecipient[selectedSliceIndex] = true;
					scope.expandTimeline(selectedSliceIndex);
					
					var xPlacemark = CanvasService.getXoffset(yearLetters[0].accuratYear);
				    var width = CanvasService.getWidth();
				    
				    var leftOfTimelineExpansion = 0;
				    var centerOfTimelineExpansion = 0;
					var topOfTimelineExpansion = (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset);
					for (var i = 0; i < selectedSliceIndex; i++)
					{
						if (scope.isTimelineExpandedForRecipient[i]) topOfTimelineExpansion += scope.TIMELINE_EXTENSION_HEIGHT; 
					}
					
					var expansionContainer = d3.select(".chartArea").insert("g", "g.rc" + (selectedSliceIndex))
						.attr("class", "recipient-container expansion rce" + selectedSliceIndex + " rc" + selectedSliceIndex)
						.attr("baseX", 0)
		            	.attr("baseY", topOfTimelineExpansion)
		            	.attr("transform", "translate(0, " + topOfTimelineExpansion + ")");
						
					expansionContainer.append("rect")
						.attr("width", CanvasService.getWidth())
						.attr("height", scope.TIMELINE_EXTENSION_HEIGHT)
						.style("fill", "#F5EEDF")
						.style("fill-opacity", "0.60");
					
					
				    
				    
				    if (xPlacemark < width/3)
				    {
				    	leftOfTimelineExpansion = 0;
				    	centerOfTimelineExpansion = xPlacemark;
				    }
				    else if (xPlacemark > (2/3*width)) 
				    {
				    	leftOfTimelineExpansion = 1/3*width;
				    	centerOfTimelineExpansion = xPlacemark - leftOfTimelineExpansion;
				    }
				    else
				    {
				    	leftOfTimelineExpansion = xPlacemark - (width/3);
				    	centerOfTimelineExpansion = 0.5*(width*2/3);
				    }
					
					var monthAxis = d3.svg.axis()
			        	.scale(CanvasService.getMonthScale())
			        	.orient("bottom");
					
				    var expansionChartArea = expansionContainer.append("g")
			    		.attr("class", "LettersContainer")
			    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + CanvasService.getMargin().top + ")");
			    
				    expansionContainer.append("rect")
						.attr("width", CanvasService.getWidth()*2/3)
						.attr("height", 143)
						.style("fill", "#F5EEDF")
						.style("fill-opacity", "0.70")
						.attr("transform", "translate(" + leftOfTimelineExpansion + "," + -13 + ")");
				    
				    expansionContainer.append("g")
				        .attr("class", "xAxis")
				        .attr("transform", "translate(" + leftOfTimelineExpansion + "," + 80 + ")")
				        .call(monthAxis)
				        .selectAll("text")
				        .style("font-size", scope.X_AXIS_FONT_SIZE)
				        .style("font-weight", scope.X_AXIS_FONT_WEIGHT)
				        .style("font-family", scope.X_AXIS_FONT_FAMILY);
					
				    var horizontalLine = expansionContainer.append("line")
	        			//.attr("class", "horizontal-line " + sliceClass + " l" + letter.id + " rc" + sliceIndex)
	        			//.attr("length", length)
	        			.attr("x1", 0)
		                .attr("y1", 0)
		                .attr("x2", width*2/3)
		                .attr("y2", 0)
		                .attr("transform", "translate(" + leftOfTimelineExpansion + ",80)")
		                .style("stroke", "rgb(168,164,155)")
		                .style("stroke-width", "1px");
				    
				    
				    var drawAuthor = false;
				    var drawRecipient = false;
				    
				    if (placemarkType == 0)
				    {
				    	drawAuthor = true;
				    }
				    else if (placemarkType == 1)
				    {
				    	drawRecipient = true;
				    }
				    else
				    {
				    	drawAuthor = true;
				    	drawRecipient = true;
				    }
				    
				    if (drawAuthor)
				    {
				    	expansionContainer.append("line")
		        			//.attr("class", "horizontal-line " + sliceClass + " l" + letter.id + " rc" + sliceIndex)
		        			//.attr("length", length)
		        			.attr("x1", leftOfTimelineExpansion + centerOfTimelineExpansion + scope.VERTICAL_LINES_OFFSET_AUTHOR)
			                .attr("y1", -2)
			                .attr("x2", leftOfTimelineExpansion + centerOfTimelineExpansion + scope.VERTICAL_LINES_OFFSET_AUTHOR)
			                .attr("y2", 15)
			                .style("stroke", "rgb(168,164,155)")
			                .style("stroke-width", "1px");
				    }
				    
				    if (drawRecipient)
				    {
				    	expansionContainer.append("line")
		        			//.attr("class", "horizontal-line " + sliceClass + " l" + letter.id + " rc" + sliceIndex)
		        			//.attr("length", length)
		        			.attr("x1", leftOfTimelineExpansion + centerOfTimelineExpansion + scope.VERTICAL_LINES_OFFSET_RECIPIENT)
			                .attr("y1", -2)
			                .attr("x2", leftOfTimelineExpansion + centerOfTimelineExpansion + scope.VERTICAL_LINES_OFFSET_RECIPIENT)
			                .attr("y2", 15)
			                .style("stroke", "rgb(168,164,155)")
			                .style("stroke-dasharray", "3,2")
			                .style("stroke-width", "1px");
				    }
				    
				    var dayScale = CanvasService.getDayScale();
				    
				    for (var i = 0; i < yearLetters.length; i++)
				    {
				    	var letter = yearLetters[i];
				    	var isAuthor = DataService.isPersonAuthorById(personId, letter);
				    	var xOffset = leftOfTimelineExpansion + dayScale(TimeService.getDayOfYear(letter.date));
				    	var lineDasharray;
				    	var lineVerticalOffset;
				    	
				    	if (isAuthor)
				    	{
				    		lineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
				    		lineVerticalOffset = scope.VERTICAL_LINES_OFFSET_AUTHOR;
				    	}
				    	else
				    	{
				    		lineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
				    		lineVerticalOffset = scope.VERTICAL_LINES_OFFSET_RECIPIENT;
				    	}
				    	
					    var xBezierCurveStart = leftOfTimelineExpansion + centerOfTimelineExpansion + lineVerticalOffset;
					    var yBezierCurveStart = 15;
					   
					   	var xBezierCurveEnd = xOffset;
				       	var yBezierCurveEnd = 80;			            	
				       	
				       	var xBezierCurveControl = xOffset;
				       	var yBezierCurveControl = 15;
				       	
			        	var d = "M" + xBezierCurveStart + "," + yBezierCurveStart + " Q" + xBezierCurveControl + "," + yBezierCurveControl + " " + xBezierCurveEnd + "," + yBezierCurveEnd;
			        	
			        	expansionContainer.append("path")
			        		.attr("class", "bezier-curve")
			        		.attr("transform", "translate(" + 0 + ",0)")
			        		.attr("d", d)
			        		.style("stroke-dasharray", lineDasharray);
						
			        	expansionContainer.append("rect")
			            	.style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			            	.attr("letter-id", letter.id)
		        	   		.attr("letter-year", letter.accuratYear)
			            	.attr("transform", "translate(" + (xOffset - scope.RECT_WIDTH/2)  + "," + (80 - scope.RECT_HEIGHT/2) + ")")
		        	   		.attr("width", scope.RECT_WIDTH)
		        	   		.attr("height", scope.RECT_HEIGHT);
				    }
				}	
				else
				{
					scope.isTimelineExpandedForRecipient[selectedSliceIndex] = false;
					scope.compressTimeline(selectedSliceIndex);
					
					d3.select(".rce" + selectedSliceIndex).remove();
				}
			};
			
			scope.expandTimeline = function(selectedSliceIndex)
			{
				d3.select(".viewer").attr("height", (parseFloat(d3.select(".viewer").attr("height")) + scope.TIMELINE_EXTENSION_HEIGHT));
				
				for (var k = selectedSliceIndex + 1; k < scope.recipientContainerCount; k++)
				{
					d3.selectAll(".recipient-container").filter(".rc" + k)
						.attr("baseX", function(d, i) {return (parseFloat(d3.select(this).attr("baseX")) + 0);})
						.attr("baseY", function(d, i) {return (parseFloat(d3.select(this).attr("baseY")) + scope.TIMELINE_EXTENSION_HEIGHT);})
						.attr("transform", function(d, i) {return "translate(" + d3.select(this).attr("baseX") + "," + d3.select(this).attr("baseY") + ")";});
					
					d3.selectAll(".vertical-line").filter(".rc" + k)
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) + scope.TIMELINE_EXTENSION_HEIGHT;});
					
					d3.selectAll(".horizontal-line").filter(".rc" + k)
						.attr("y1", function(d, i) {return parseFloat(d3.select(this).attr("y1")) + scope.TIMELINE_EXTENSION_HEIGHT;})
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) + scope.TIMELINE_EXTENSION_HEIGHT;});
				}
			};
			
			scope.compressTimeline = function(selectedSliceIndex)
			{
				for (var k = selectedSliceIndex + 1; k < scope.recipientContainerCount; k++)
				{
					d3.selectAll(".recipient-container").filter(".rc" + k)
						.attr("baseX", function(d, i) {return (parseFloat(d3.select(this).attr("baseX")) + 0);})
						.attr("baseY", function(d, i) {return (parseFloat(d3.select(this).attr("baseY")) - scope.TIMELINE_EXTENSION_HEIGHT);})
						.attr("transform", function(d, i) {return "translate(" + d3.select(this).attr("baseX") + "," + d3.select(this).attr("baseY") + ")";});
					
					d3.selectAll(".vertical-line").filter(".rc" + k)
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) - scope.TIMELINE_EXTENSION_HEIGHT;});
					
					d3.selectAll(".horizontal-line").filter(".rc" + k)
						.attr("y1", function(d, i) {return parseFloat(d3.select(this).attr("y1")) - scope.TIMELINE_EXTENSION_HEIGHT;})
						.attr("y2", function(d, i) {return parseFloat(d3.select(this).attr("y2")) - scope.TIMELINE_EXTENSION_HEIGHT;});
				}
				
				d3.select(".viewer").attr("height", (parseFloat(d3.select(".viewer").attr("height")) - scope.TIMELINE_EXTENSION_HEIGHT));
			};
			
			scope.drawRectangle = function(recipientContainer, sliceOffset, letter, isAuthor)
			{
				var rectOffsetActual;
				
            	if (isAuthor) rectOffsetActual = scope.RECT_OFFSET_AUTHOR;
            	else rectOffsetActual = scope.RECT_OFFSET_RECIPIENT;
                
	            recipientContainer.append("rect")
	            	.style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
	            	.attr("letter-id", letter.id)
        	   		.attr("letter-year", letter.accuratYear)
	            	.attr("transform", "translate(" + (CanvasService.getXoffset(letter.accuratYear) + rectOffsetActual)  + "," + scope.RECT_OFFSET_VERTICAL + ")")
        	   		.attr("width", scope.RECT_WIDTH)
        	   		.attr("height", scope.RECT_HEIGHT)
        	   		.on("mouseover", function(d)
	                {
						var element = d3.select(this);
						scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
	                })
	                .on("mouseout", function(d)
	                {
	                	var element = d3.select(this);
	                	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
	                });
        	};
			
        	scope.drawName = function(recipientContainer, sliceOffset, letter, isAuthor, sliceIndex, sliceLetters)
			{
        		var composedClass;
        		if (isAuthor) composedClass = DataService.getComposedRecipientClass(letter);
        		else composedClass = DataService.getComposedAuthorClass(letter);
        		
        		if (!scope.drawnRecipientNames[sliceIndex])
	    		{
	    			scope.drawnRecipientNames[sliceIndex] = true;
	    		
	    			var label = recipientContainer.append("text")
						.attr("class", "corresponding-person-container")
						.attr("text-anchor", "end")
						.attr("transform", "translate(" + (CanvasService.getXoffset(letter.accuratYear) - scope.DISTANCE_PERSON_NAME_TO_FIRST_LETTER)  + ",0)");
					
					var peopleCollection;
					if (isAuthor) peopleCollection = letter.recipients;
					else peopleCollection = letter.authors;
					
					for (var i = 0; i < peopleCollection.length; i++)
					{
						var nameToken;
						if (isAuthor) nameToken = DataService.getComposedRecipientNameToken(letter, i);
						else nameToken = DataService.getComposedAuthorNameToken(letter, i);
						
						var composedClassLetters = "";
						for (var j = 0; j < sliceLetters.length; j++) composedClassLetters += " l" + sliceLetters[j].id;
						
						label.append("tspan")
		        			.text(nameToken)
		        			.attr("class", "person-name-token p" + peopleCollection[i].id + composedClassLetters)
		        			.attr("person-id", peopleCollection[i].id)
		        			.on("click", function(d) 
			                {
		        				HighlightService.setPersonHoverId(null);
		        				var url = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWho);
		                    	url = LocationService.setUrlParameter(SymbolsService.urlTokenPerson, d3.select(this).attr("person-id"));
		                    	window.location = url;
			                })
			                .on("mouseover", function(d)
			                {
								var element = d3.select(this);
								scope.$apply(function() {HighlightService.setPersonHoverId(element.attr("person-id"));});
			                })
			                .on("mouseout", function(d)
			                {
			                	var element = d3.select(this);
			                	scope.$apply(function() {HighlightService.setPersonHoverId(null);});
			                });
					}
	    		}
        		
        		return composedClass;
			};
        	
			scope.drawRecipientContainer = function(chartArea, sliceIndex, sliceLetters, personId)
			{
				var sliceHeight = scope.HORIZONTAL_SLICE_HEIGHT;
		    	var sliceOffset = (sliceIndex + 1) * scope.HORIZONTAL_SLICE_HEIGHT;
    			
		    	var recipientContainer;
		    	if (scope.drawnRecipientsByContainer[sliceIndex] == null)
		    	{
	    			recipientContainer = chartArea.append("g")
		            	.attr("class", "recipient-container rc" + sliceIndex)
		            	.attr("baseX", 0)
		            	.attr("baseY", (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset))
		            	.attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")");
	    			
	    			scope.drawnRecipientsByContainer[sliceIndex] = recipientContainer;
		    	}
		    	else recipientContainer = scope.drawnRecipientsByContainer[sliceIndex];
				
		    	return recipientContainer;
			};
			
			scope.sliceHasLettersInYear = function(sliceLetters, year)
			{
				var found = false;
				for (var i = 0; i < sliceLetters.length; i++)
				{
					if (sliceLetters[i].accuratYear == year)
					{
						found = true;
						break;
					}
				}
				return found;
			};
			
			scope.hasProcessedLetter = function(letterId)
			{
				found = false;
				for (var i = 0; i < scope.processedLetterIds.length; i++)
				{
					if (scope.processedLetterIds[i] == letterId)
					{
						found = true;
						break;
					}
				}
				return found;
			};
			
			scope.hasProcessedRecipient = function(recipientId)
			{
				found = false;
				for (var i = 0; i < scope.processedRecipientIds.length; i++)
				{
					if (scope.processedRecipientIds[i] == recipientId)
					{
						found = true;
						break;
					}
				}
				return found;
			};
        	
			scope.drawBezierCurve = function(curvesContainer, letter, isAuthor)
			{
				// punto fisso di partenza delle curve di bezier
			    var xBezierCurveStart = (CanvasService.getWidth()/2);
			    var yBezierCurveStart = 0;
			    
			    var drawnBezierCurvesByYear;
			    var verticalLineOffsetActual;
			    var verticalLineDasharray;
			    
			    var composedClass;
			    
			    if (isAuthor)
			    {
			    	drawnBezierCurvesByYear = scope.drawnBezierCurvesAuthorByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_AUTHOR;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
    				composedClass = DataService.getComposedRecipientClass(letter) + " l" + letter.id;
			    }
			    else
			    {
			    	drawnBezierCurvesByYear = scope.drawnBezierCurvesRecipientByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_RECIPIENT;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
    				composedClass = DataService.getComposedAuthorClass(letter) + " l" + letter.id;
			    }
			    
			    var existingBezierCurve = drawnBezierCurvesByYear[letter.accuratYear];
				if (existingBezierCurve == null)
				{
					// no existing beziers in year
					// draw the curve
					// make it visible
					// set it as drawn
					
					var xBezierCurveEnd = CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveEnd = CanvasService.getHeight()/6 - scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES - scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE;			            	
		        	var xBezierCurveControl = CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveControl = 0;
		        	
		        	var d = "M" + xBezierCurveStart + "," + yBezierCurveStart + " Q" + xBezierCurveControl + "," + yBezierCurveControl + " " + xBezierCurveEnd + "," + yBezierCurveEnd;
		        	
		        	var bezierCurve = curvesContainer.append("path")
		        		.attr("class", "bezier-curve " + composedClass)
		        		.attr("id", "static")
		        		.attr("d", d)
		        		.style("stroke-dasharray", verticalLineDasharray);
					
					drawnBezierCurvesByYear[letter.accuratYear] = bezierCurve;
				}
				else
				{
					// curve is already existing
					// just update curve class attributes
					var existingBezierCurveClass = existingBezierCurve.attr("class");
					existingBezierCurveClass += " " + composedClass;
					existingBezierCurve.attr("class", existingBezierCurveClass);
				}
			};
			
			scope.drawHorizontalLine = function(horizontalLinesContainer, sliceOffset, personId, sliceLetters, sliceIndex, sliceClass)
			{
				if (sliceLetters.length > 1)
				{
					var firstLetter = sliceLetters[0];
					var lastLetter = sliceLetters[sliceLetters.length - 1];
	        		
					var x1base = CanvasService.getXoffset(firstLetter.accuratYear);
		            var x1offset;
		            if (DataService.isPersonAuthorById(personId, firstLetter)) x1offset = scope.HORIZONTAL_LINES_OFFSET_AUTHOR;
		            else x1offset = scope.HORIZONTAL_LINES_OFFSET_RECIPIENT;
		            var x1 = x1base + x1offset;
					
		            // skip first letter
					for (var i = 1; i < sliceLetters.length; i++)
					{
		        		var letter = sliceLetters[i];
						
		        		// ignore multiple first letters 
		        		if (letter.accuratYear != firstLetter.accuratYear)
		        		{
			        		var x2base = CanvasService.getXoffset(letter.accuratYear); 
				            var x2offset;
				            if (DataService.isPersonAuthorById(personId, letter)) x2offset = scope.HORIZONTAL_LINES_OFFSET_AUTHOR;
				            else x2offset = scope.HORIZONTAL_LINES_OFFSET_RECIPIENT;
				            var x2 = x2base + x2offset;
			        		
				            var length = x2-x1;
				            
			        		var horizontalLine = horizontalLinesContainer.insert("line", ":first-child")
			        			.attr("class", "horizontal-line " + sliceClass + " l" + letter.id + " rc" + sliceIndex)
			        			.attr("length", length)
			        			.attr("x1", x1)
				                .attr("y1", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("x2", x2)
				                .attr("y2", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")");
				                //.style("stroke", scope.HORIZONTAL_LINES_COLOR)
				                //.style("stroke-width", scope.HORIZONTAL_LINES_WIDTH);
							
			        		var existingHorizontalLine = scope.drawnHorizontalLinesByRecipient[sliceIndex];
							if (existingHorizontalLine == null)
							{
								// no existing lines in year
								// make visible the one just drawn
								horizontalLine.attr("id", "static");
								scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
							}
							else
							{
								// there exist already drawn lines
								if (parseFloat(horizontalLine.attr("length")) >= parseFloat(existingHorizontalLine.attr("length")))
								{
									existingHorizontalLine.classed("hidden", true);
									existingHorizontalLine.attr("id", "dynamic");									
									horizontalLine.attr("id", "static");
									scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
								}
								else
								{
									horizontalLine.classed("hidden", true);
									horizontalLine.attr("id", "dynamic");
								}
							}
		        		}
					}
				}
			};
			
			
			scope.drawVerticalLine = function(verticalLinesContainer, sliceOffset, letter, isAuthor, personId, sliceIndex)
			{
				var drawnVerticalLinesByYear;
				var verticalLineOffsetActual;
				var verticalLineDasharray;
				var composedClass;
				
				if (isAuthor)
			    {
					drawnVerticalLinesByYear = scope.drawnVerticalLinesAuthorByYear;
					verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_AUTHOR;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_AUTHOR;
    				composedClass = DataService.getComposedRecipientClass(letter);
			    }
			    else
			    {
			    	drawnVerticalLinesByYear = scope.drawnVerticalLinesRecipientByYear;
			    	verticalLineOffsetActual = scope.VERTICAL_LINES_OFFSET_RECIPIENT;
    				verticalLineDasharray = scope.VERTICAL_LINES_DASHARRAY_RECIPIENT;
    				composedClass = DataService.getComposedAuthorClass(letter);
			    }
				
				var verticalLine = verticalLinesContainer.insert("line", ":first-child")
					.attr("class", "vertical-line " + composedClass + " l" + letter.id + " rc" + sliceIndex)
					.attr("length", sliceOffset)
	                .style("stroke-dasharray", verticalLineDasharray)
	                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")")
                	.attr("x1", CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y1", -(sliceOffset + scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES))
	                .attr("x2", CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y2", scope.VERTICAL_LINES_OFFSET_VERTICAL);
				
				var existingVerticalLine = drawnVerticalLinesByYear[letter.accuratYear];
				if (existingVerticalLine == null)
				{
					// no existing lines in year
					// make visible the one just drawn
					verticalLine.attr("id", "static");
					drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
				}
				else
				{
					// there exist already drawn lines
					if (parseFloat(verticalLine.attr("length")) > parseFloat(existingVerticalLine.attr("length")))
					{
						// new one is longer than existing one
						existingVerticalLine.classed("hidden", true);
						existingVerticalLine.attr("id", "dynamic");
						verticalLine.attr("id", "static");
						drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
					}
					else
					{
						verticalLine.classed("hidden", true);
						verticalLine.attr("id", "dynamic");
					}
				}
			};
			
		}
	};
}]);