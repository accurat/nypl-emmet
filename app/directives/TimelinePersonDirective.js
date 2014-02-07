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
			
			scope.AUTHOR_NAME_FONT_FAMILY = "'Gentium Basic', serif";
			scope.AUTHOR_NAME_FONT_WEIGHT = "700";
			scope.AUTHOR_NAME_FONT_SIZE = "24px";
 			
			scope.PERSON_NAME_FONT_FAMILY = "'Gentium Basic', serif";
			scope.PERSON_NAME_FONT_WEIGHT = "500";
			scope.PERSON_NAME_FONT_SIZE = "11px";
			scope.PERSON_NAME_COLOR_DEFAULT = "rgb(168,164,155)";
			scope.PERSON_NAME_COLOR_HOVER = "rgb(0,0,0)";
			
			scope.BEZIER_CURVES_COLOR = "rgb(168,164,155)";
			scope.BEZIER_CURVES_COLOR_HIGHLIGHT = "rgb(0,0,0)";
			
			scope.VERTICAL_LINES_COLOR = "rgb(168,164,155)";
			scope.VERTICAL_LINES_COLOR_HIGHLIGHT = "rgb(0,0,0)";
			scope.VERTICAL_LINES_WIDTH = "1px";
			scope.VERTICAL_LINES_DASHARRAY_AUTHOR = "";
			scope.VERTICAL_LINES_DASHARRAY_RECIPIENT = "3,2";
			scope.VERTICAL_LINES_VISIBILITY_YES = "visible";
			scope.VERTICAL_LINES_VISIBILITY_NO = "hidden";
			scope.VERTICAL_LINES_OFFSET_AUTHOR = -2;
			scope.VERTICAL_LINES_OFFSET_RECIPIENT = 6;
			scope.VERTICAL_LINES_OFFSET_VERTICAL = -3;
				
			scope.HORIZONTAL_LINES_COLOR = "rgb(168,164,155)";
			scope.HORIZONTAL_LINES_COLOR_HIGHLIGHT = "rgb(0,0,0)";
			scope.HORIZONTAL_LINES_WIDTH = "1 px";
			scope.HORIZONTAL_LINES_VISIBILITY_YES = "visible";
			scope.HORIZONTAL_LINES_VISIBILITY_NO = "hidden";
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
			// LISTENERS
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
							
							d3.selectAll(".person-name-token").filter(".p" + newValue).style("fill", scope.PERSON_NAME_COLOR_HIGHLIGHT);
	                        d3.selectAll(".horizontal-line").filter(".p" + newValue).style("stroke", scope.HORIZONTAL_LINES_COLOR_HIGHLIGHT).style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
	                        d3.selectAll(".vertical-line").filter(".p" + newValue).style("stroke", scope.VERTICAL_LINES_COLOR_HIGHLIGHT).style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
	                        d3.selectAll(".bezier-curve").filter(".p" + newValue).style("stroke", scope.BEZIER_CURVES_COLOR_HIGHLIGHT);
						}
						else
						{
							d3.selectAll(".person-name-token").style("fill", scope.PERSON_NAME_COLOR_DEFAULT);
							d3.selectAll(".horizontal-line").filter(".p" + oldValue).style("stroke", scope.HORIZONTAL_LINES_COLOR).style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
							d3.selectAll(".horizontal-line").filter("#static").style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							d3.selectAll(".vertical-line").filter(".p" + oldValue).style("stroke", scope.VERTICAL_LINES_COLOR).style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
							d3.selectAll(".vertical-line").filter("#static").style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							
							d3.selectAll(".bezier-curve").filter(".p" + oldValue).style("stroke", scope.BEZIER_CURVES_COLOR);
						}
					}, true);
			
			scope.$watch(
					function() {return HighlightService.getLetterId();}, 
					function (newValue, oldValue) 
					{
						if (newValue) 
						{
							d3.selectAll(".person-name-token").filter(".l" + newValue).style("fill", scope.PERSON_NAME_COLOR_HIGHLIGHT);
							d3.selectAll(".horizontal-line").filter(".l" + newValue).style("stroke", scope.VERTICAL_LINES_COLOR_HIGHLIGHT).style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							d3.selectAll(".vertical-line").filter(".l" + newValue).style("stroke", scope.VERTICAL_LINES_COLOR_HIGHLIGHT).style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							d3.selectAll(".bezier-curve").filter(".l" + newValue).style("stroke", scope.BEZIER_CURVES_COLOR_HIGHLIGHT);
						}	
						else
						{
							d3.selectAll(".person-name-token").style("fill", scope.PERSON_NAME_COLOR_DEFAULT);
							d3.selectAll(".horizontal-line").filter(".l" + oldValue).style("stroke", scope.VERTICAL_LINES_COLOR).style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
							d3.selectAll(".horizontal-line").filter("#static").style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							d3.selectAll(".vertical-line").filter(".l" + oldValue).style("stroke", scope.VERTICAL_LINES_COLOR).style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
							d3.selectAll(".vertical-line").filter("#static").style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
							d3.selectAll(".bezier-curve").filter(".l" + oldValue).style("stroke", scope.BEZIER_CURVES_COLOR);
							
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
			    	.attr("text-anchor", "middle")
			    	.attr("transform", "translate(" + (CanvasService.getWidth()/2 + CanvasService.getMargin().left)  + "," + (CanvasService.getHeight()/6) + ")")
			        .style("font-size", scope.AUTHOR_NAME_FONT_SIZE)
			        .style("font-weight", scope.AUTHOR_NAME_FONT_WEIGHT)
			        .style("font-family", scope.AUTHOR_NAME_FONT_FAMILY);
			    
			    // itera sugli anni della timeline
			    var years = TimeService.getYears();
			    for (var yearIndex = 0; yearIndex < years.length; yearIndex++)
			    {
			    	var year = years[yearIndex];
			    	
			    	// itera sulle persone che hanno scambiato lettere
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
			    			
					    	// itera sulle lettere della persona
				    		for (var letterIndex = 0; letterIndex < sliceLetters.length; letterIndex++)
				    		{
				    			var letter = sliceLetters[letterIndex];
				    			if (!scope.hasProcessedLetter(letter.id))
				    			{
				    				var isPersonAuthor = DataService.isPersonAuthorById(personId, letter);
					    			scope.processedLetterIds.push(letter.id);
					    			scope.drawBezierCurve(curvesContainer, letter, isPersonAuthor);
					    			scope.drawVerticalLine(verticalLinesContainer, sliceOffset, letter, isPersonAuthor, personId);
					    			
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
						else scope.drawPlacemark(recipientContainer, sliceOffset, yearLetters, personId);
					}
				}				
			};
			
			scope.drawPlacemark = function(recipientContainer, sliceOffset, yearLetters, personId)
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
                   	.style("fill", scope.PLACEMARK_COLOR)
            	   	.style("stroke", scope.PLACEMARK_STROKE_COLOR)
            	   	.style("stroke-width", scope.PLACEMARK_STROKE_WIDTH)
        	   		.attr("cursor", "pointer")
            	   	.attr("transform", "translate(" + (CanvasService.getXoffset(yearLetters[0].accuratYear) + placemarkOffsetActual)  + "," + scope.PLACEMARK_OFFSET_VERTICAL + ")")
        	   		.attr("width", placemarkWidthActual)
        	   		.attr("height", scope.PLACEMARK_HEIGHT);
            	
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
						//scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
						scope.$apply(function() {HighlightService.setLetterHoverId(element.attr("letter-id"));});
	                })
	                .on("mouseout", function(d)
	                {
	                	var element = d3.select(this);
	                	//scope.$apply(function() {HighlightService.setLetterHoverId(null);});
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
						.attr("transform", "translate(" + (CanvasService.getXoffset(letter.accuratYear) - scope.DISTANCE_PERSON_NAME_TO_FIRST_LETTER)  + ",0)")
						.style("font-size", scope.PERSON_NAME_FONT_SIZE)
						.style("font-family", scope.PERSON_NAME_FONT_FAMILY)
						.style("font-weight", scope.PERSON_NAME_FONT_WEIGHT);
					
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
		        			.attr("cursor", "pointer")
		        			.style("fill", scope.PERSON_NAME_COLOR_DEFAULT)
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
		            	.attr("class", "recipient-container-" + sliceIndex)
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
					// non esistevano ancora linee per l'anno
					// disegna la curva
					// rendila visibile
					// impostala come già disegnata
					
					var xBezierCurveEnd = CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveEnd = CanvasService.getHeight()/6 - scope.DISTANCE_AUTHOR_NAME_TO_BEZIER_CURVES - scope.DISTANCE_BEZIER_CURVES_TO_TIMELINE;			            	
		        	var xBezierCurveControl = CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual;
		        	var yBezierCurveControl = 0;
		        	
		        	var d = "M" + xBezierCurveStart + "," + yBezierCurveStart + " Q" + xBezierCurveControl + "," + yBezierCurveControl + " " + xBezierCurveEnd + "," + yBezierCurveEnd;
		        	
		        	var bezierCurve = curvesContainer.append("path")
		        		.attr("class", "bezier-curve " + composedClass)
		        		.attr("id", "static")
		        		.attr("d", d)
		        		.style("fill", "none")
		        		.style("stroke", scope.VERTICAL_LINES_COLOR)
		                .style("stroke-width", scope.VERTICAL_LINES_WIDTH)
		                .style("stroke-dasharray", verticalLineDasharray)
		                .style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
					
					drawnBezierCurvesByYear[letter.accuratYear] = bezierCurve;
				}
				else
				{
					// esiste già curva
					// update della classe della curva
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
					
		            // salto la firstletter
					for (var i = 1; i < sliceLetters.length; i++)
					{
		        		var letter = sliceLetters[i];
						
		        		// ignoro il caso di lettere multiple corrispondenti alla prima
		        		if (letter.accuratYear != firstLetter.accuratYear)
		        		{
			        		var x2base = CanvasService.getXoffset(letter.accuratYear); 
				            var x2offset;
				            if (DataService.isPersonAuthorById(personId, letter)) x2offset = scope.HORIZONTAL_LINES_OFFSET_AUTHOR;
				            else x2offset = scope.HORIZONTAL_LINES_OFFSET_RECIPIENT;
				            var x2 = x2base + x2offset;
			        		
				            var length = x2-x1;
				            
			        		var horizontalLine = horizontalLinesContainer.insert("line", ":first-child")
			        			.attr("class", "horizontal-line " + sliceClass + " l" + letter.id)
			        			.attr("length", length)
			        			.attr("x1", x1)
				                .attr("y1", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("x2", x2)
				                .attr("y2", scope.HORIZONTAL_LINES_OFFSET_VERTICAL)
				                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")")
				                .style("stroke", scope.HORIZONTAL_LINES_COLOR)
				                .style("stroke-width", scope.HORIZONTAL_LINES_WIDTH);
							
			        		var existingHorizontalLine = scope.drawnHorizontalLinesByRecipient[sliceIndex];
							if (existingHorizontalLine == null)
							{
								// non esistevano ancora linee per l'anno
								// rendi visibile quella che hai disegnato e impostala
								horizontalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
								horizontalLine.attr("id", "static");
								scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
							}
							else
							{
								// esistevano già linee orizzontali
								if (parseFloat(horizontalLine.attr("length")) >= parseFloat(existingHorizontalLine.attr("length")))
								{
									existingHorizontalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
									existingHorizontalLine.attr("id", "dynamic");
									horizontalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
									horizontalLine.attr("id", "static");
									scope.drawnHorizontalLinesByRecipient[sliceIndex] = horizontalLine;
								}
								else
								{
									horizontalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
									horizontalLine.attr("id", "dynamic");
								}
							}
		        		}
					}
				}
			};
			
			
			scope.drawVerticalLine = function(verticalLinesContainer, sliceOffset, letter, isAuthor, personId)
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
					.attr("class", "vertical-line " + composedClass + " l" + letter.id)
					.attr("length", sliceOffset)
	    			.style("stroke", scope.VERTICAL_LINES_COLOR)
	                .style("stroke-dasharray", verticalLineDasharray)
	                .style("stroke-width", scope.VERTICAL_LINES_WIDTH)
	                .attr("transform", "translate(0," + (CanvasService.getHeight()/3 + scope.X_AXIS_HEIGHT + sliceOffset) + ")")
                	.attr("x1", CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y1", -(sliceOffset + scope.DISTANCE_TIMELINE_TO_VERTICAL_LINES))
	                .attr("x2", CanvasService.getXoffset(letter.accuratYear) + verticalLineOffsetActual)
	                .attr("y2", scope.VERTICAL_LINES_OFFSET_VERTICAL);
				
				var existingVerticalLine = drawnVerticalLinesByYear[letter.accuratYear];
				if (existingVerticalLine == null)
				{
					// non esistevano ancora linee per l'anno
					// rendi visibile quella che hai disegnato e impostala
					verticalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
					verticalLine.attr("id", "static");
					drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
				}
				else
				{
					// esistevano già linee verticali
					if (parseFloat(verticalLine.attr("length")) > parseFloat(existingVerticalLine.attr("length")))
					{
						existingVerticalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
						existingVerticalLine.attr("id", "dynamic");
						verticalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_YES);
						verticalLine.attr("id", "static");
						drawnVerticalLinesByYear[letter.accuratYear] = verticalLine;
					}
					else
					{
						verticalLine.style("visibility", scope.VERTICAL_LINES_VISIBILITY_NO);
						verticalLine.attr("id", "dynamic");
					}
				}
			};
			
		}
	};
}]);