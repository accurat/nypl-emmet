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
'MetricsService',
function(
	DataService, 
	TimeService, 
	CanvasService, 
	ColorService, 
	SymbolsService, 
	LocationService, 
	$routeParams, 
	HighlightService, 
	PopupService,
	MetricsService) 
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
			d3.selectAll(".menu-item").classed("active", false);
			d3.selectAll(".menu-item").filter(".view").filter(".view-where").classed("active", true);
			
			d3.selectAll(".menu-element").filter(".where").classed("active", false);
			if ($routeParams.whereType == SymbolsService.mapSnake) d3.selectAll(".menu-element").filter(".where").filter(".where-snake").classed("active", true);
			else d3.selectAll(".menu-element").filter(".where").filter(".where-contemporary").classed("active", true);
			
			scope.HORIZONTAL_LINES_OFFSET_VERTICAL = -5;
			scope.RECTANGLE_RATIO = 0.003;
			scope.RECTANGLE_GROUP_SPACER = 2;
			
			scope.$watch(
				function() {return DataService.hasData();}, 
				function (newValue, oldValue) {if (newValue) {scope.draw();}}, true);
		
			scope.$watch(
				function() {return HighlightService.getPersonId();}, 
				function (newValue, oldValue) 
				{
					if (!HighlightService.isPersistent() && !PopupService.isPersistent())
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
					if (!HighlightService.isPersistent() && !PopupService.isPersistent())
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
				HighlightService.reset();
				PopupService.reset();
				
				d3.select("svg").remove();
			    
				var dataPlaceCollection = DataService.getData($routeParams.dataType, SymbolsService.dataPlaceCollection, null);
				
				var viewPort = {
					width : 1700,
					height : 950
				};
				
				var viewBox = {
					width : CanvasService.getWidth(),
					height : CanvasService.getHeight()
				};
				
				
			    var svg = d3.select(".place-collection").append("svg")
			        .attr("class", "viewer")
			        .attr("width", viewBox.width)
			        .attr("height", viewBox.height)
			        .attr("viewBox", "0 0 " + viewPort.width + " " + viewPort.height)
			        .attr("preserveAspectRatio", "xMinYMin meet");
			      
			    var chartBackground = svg.append("g")
			    	.attr("class", "chartBackground");
			    
			    chartBackground.append("rect")
			    	.attr("class", "background")
			    	.attr("width", viewPort.width)
			        .attr("height", viewPort.height)
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
	                	}
	                });
			    
			    var chartArea = svg.append("g")
		    		.attr("class", "chartArea")
		    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")");
			    
			    var whereType = $routeParams.whereType;
			    if (whereType == SymbolsService.mapSnake) scope.drawMapSnake(viewPort, chartArea, dataPlaceCollection);
			    else scope.drawMapContemporary(viewPort, chartArea, dataPlaceCollection);
			    
			};
			
			scope.drawMapSnake = function(viewPort, chartArea, dataPlaceCollection)
			{
				var m = MetricsService.getMetrics(SymbolsService.mapSnake);
				
				chartArea.append("image")
				    .attr("xlink:href","img/map-snake.svg")
				    .attr("width", viewPort.width * m.snake.width)
				    .attr("height", (viewPort.width * m.snake.width)/m.snake.ratio)
				    .attr("transform", "translate(" + viewPort.width * m.snake.left + "," + viewPort.height * m.snake.top + ")")
				    .on("click", function() 
	                {
	                	if (PopupService.isVisible() && PopupService.isPersistent())
	                	{
	                		PopupService.setPersistent(false);
	                		PopupService.hidePopup();
	                		
	                		scope.$apply(function() {HighlightService.setLetterHoverId(null);});
	                		scope.$apply(function() {HighlightService.setPersonHoverId(null);});
	                	}
	                });;
				
				for (var groupId in m.groups)
				{
					var group = m.groups[groupId];
					
					var groupContainer = chartArea.append("g")
						.attr("class", "letter-container " + group.name)
						.attr("transform", "translate(" + viewPort.width * group.left + "," + viewPort.height * group.top + ")");
					
					var groupLetters = null;
					if (group.id == 'ca' || group.id == 'uk' || group.id == 'fr')
					{
						groupLetters = dataPlaceCollection.lettersByForeignCountry[group.name];
					}
					else if (group.id == 'md' || group.id == 'nh' || group.id == 'nj' || group.id == 'ny' || group.id == 'nc' || group.id == 'pa' || group.id == 'sc' || group.id == 'va')
					{
						groupLetters = dataPlaceCollection.lettersByUSState[group.name];
					}
					else if (group.id == 'ne')
					{
						groupLetters = new Array();
						
						for (var stateName in dataPlaceCollection.lettersByUSState)
						{
							if (stateName == 'Vermont' || 
								stateName == 'New Hampshire' || 
								stateName == 'Massachusetts' ||
								stateName == 'Connecticut') groupLetters = groupLetters.concat(dataPlaceCollection.lettersByUSState[stateName]);
						}
					}
					else if (group.id == 'us')
					{
						groupLetters = new Array();
					
						for (var stateName in dataPlaceCollection.lettersByUSState)
						{
							if (stateName != 'Maryland' && 
								stateName != 'New Hampshire' &&
								stateName != 'Vermont' &&
								stateName != 'Massachusetts' &&
								stateName != 'Connecticut' &&
								stateName != 'New Jersey' &&
								stateName != 'New York' &&
								stateName != 'North Carolina' &&
								stateName != 'Pennsylvania' &&
								stateName != 'South Carolina' && 
								stateName != 'Virginia') groupLetters = groupLetters.concat(dataPlaceCollection.lettersByUSState[stateName]);
						}
					}
					else if (group.id == 'other')
					{
						groupLetters = new Array();
						
						for (var countryName in dataPlaceCollection.lettersByForeignCountry)
						{
							if (countryName != 'Canada' && 
								countryName != 'United Kingdom' && 
								countryName != 'France') groupLetters = groupLetters.concat(dataPlaceCollection.lettersByForeignCountry[countryName]);
						}
					}
					else if (group.id == 'unknown')
					{
						groupLetters = dataPlaceCollection.lettersWithUnknownPlace;
					}
					else if (group.id == 'undetermined')
					{
						groupLetters = dataPlaceCollection.lettersWithUndeterminedPlace;
					}
					
					if (groupLetters != null)
					{
						var line = -1;
						var rectangleSize = viewPort.width * scope.RECTANGLE_RATIO;
						var baseX = 0;
						
						for (var i = 0; i < groupLetters.length; i++)
						{
							var letter = groupLetters[i];
						
							var groupSpacer = 0;
							if ((i+1) % 5 == 0) groupSpacer = scope.RECTANGLE_GROUP_SPACER;
							
							if (i % group.elem == 0)
							{
								line++;
								baseX = 0;
							}
							
							var xRectangle = baseX;
							baseX += (rectangleSize + 1) + groupSpacer;
							var yRectangle = (line * (rectangleSize + 1));
							

							var composedClass = "";
			                for (var j = 0; j < letter.authors.length; j++) composedClass += " p" + letter.authors[j].id;
							
							groupContainer.append("rect")
			                    .attr("class", "letter l" + letter.id + " t" + letter.chapterId + composedClass + " y" + letter.accuratYear)
			                	.attr("person-id", letter.authors[0].id)
			                    .attr("letter-id", letter.id)
			                    .attr("letter-year", letter.accuratYear)
			                    .attr("letter-topic", letter.chapterId)
			                    .attr("width", rectangleSize)
			                    .attr("height", rectangleSize)
			                    .attr("y", yRectangle)
			                    .attr("x", xRectangle)
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .on("click", function(d)
			                    {
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
				                    	}
			                    	}
			                    })
			                    .on("mouseout", function(d)
			                    {
									if (!PopupService.isPersistent())
									{
				                    	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
										scope.$apply(function() {HighlightService.setPersonHoverId(null);});
									}
			                    });
						}
					
						
						groupContainer.append("text")
					    	.text(group.name)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "left")
					    	.attr("transform", "translate(0, -10)");
						
						if (group.isColony)
						{
							
							groupContainer.append("line")
			        			.attr("class", "horizontal-line")
			        			.attr("x1", 0)
				                .attr("y1", 0)
				                .attr("x2", (viewPort.width * group.labelLeft))
				                .attr("y2", 0)
				                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
						
							groupContainer.append("text")
						    	.text(group.shortName)
						    	.attr("class", "group-name")
						    	.attr("text-anchor", "end")
						    	.attr("transform", "translate(" + (viewPort.width * group.labelLeft) + ", -10)");
							
						}
						else
						{
							groupContainer.append("line")
			        			.attr("class", "horizontal-line")
			        			.attr("x1", 0)
				                .attr("y1", 0)
				                .attr("x2", (group.elem)  * (rectangleSize + 1) + scope.RECTANGLE_GROUP_SPACER * (group.elem / 5))
				                .attr("y2", 0)
				                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
						}
					}
				}
			};
			
			scope.drawMapContemporary = function(viewPort, chartArea, dataPlaceCollection)
			{
				var m = MetricsService.getMetrics(SymbolsService.mapContemporary);
				
				chartArea.append("image")
				    .attr("xlink:href","img/map-eastcoast.svg")
				    .attr("width", viewPort.width * m.usa.width)
				    .attr("height", (viewPort.width * m.usa.width)/m.usa.ratio)
				    .attr("transform", "translate(" + viewPort.width * m.usa.left + "," + viewPort.height * m.usa.top + ")")
				    .on("click", function() 
	                {
	                	if (PopupService.isVisible() && PopupService.isPersistent())
	                	{
	                		PopupService.setPersistent(false);
	                		PopupService.hidePopup();
	                		
	                		scope.$apply(function() {HighlightService.setLetterHoverId(null);});
	                		scope.$apply(function() {HighlightService.setPersonHoverId(null);});
	                	}
	                });;
				
				for (var groupId in m.groups)
				{
					var group = m.groups[groupId];
					var groupLetters = dataPlaceCollection.lettersByUSState[group.name];
					
					if (group.displayOn == 'left')
					{
						var groupContainer = chartArea.append("g")
							.attr("class", "letter-container " + group.name)
							.attr("transform", "translate(" + viewPort.width * group.left + "," + viewPort.height * group.top + ")");
						
						var line = -1;
						var rectangleSize = viewPort.width * scope.RECTANGLE_RATIO;
						var baseX = 0;
						
						for (var i = 0; i < groupLetters.length; i++)
						{
							var letter = groupLetters[i];
						
							var groupSpacer = 0;
							if ((i+1) % 5 == 0) groupSpacer = scope.RECTANGLE_GROUP_SPACER;
							
							if (i % group.elem == 0)
							{
								line++;
								baseX = 0;
							}
							
							var xRectangle = baseX;
							baseX += (rectangleSize + 1) + groupSpacer;
							var yRectangle = (line * (rectangleSize + 1));
							

							var composedClass = "";
			                for (var j = 0; j < letter.authors.length; j++) composedClass += " p" + letter.authors[j].id;
							
							groupContainer.append("rect")
			                    .attr("class", "letter l" + letter.id + " t" + letter.chapterId + composedClass + " y" + letter.accuratYear)
			                	.attr("person-id", letter.authors[0].id)
			                    .attr("letter-id", letter.id)
			                    .attr("letter-year", letter.accuratYear)
			                    .attr("letter-topic", letter.chapterId)
			                    .attr("width", rectangleSize)
			                    .attr("height", rectangleSize)
			                    .attr("y", yRectangle)
			                    .attr("x", xRectangle)
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .on("click", function(d)
			                    {
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
				                    	}
			                    	}
			                    })
			                    .on("mouseout", function(d)
			                    {
									if (!PopupService.isPersistent())
									{
				                    	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
										scope.$apply(function() {HighlightService.setPersonHoverId(null);});
									}
			                    });
						}
					
						
						groupContainer.append("line")
		        			.attr("class", "horizontal-line")
		        			.attr("x1", 0)
			                .attr("y1", 0)
			                .attr("x2", (viewPort.width * group.label))
			                .attr("y2", 0)
			                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
						
						groupContainer.append("text")
					    	.text(group.name)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "left")
					    	.attr("transform", "translate(0, -10)");
						
						var labelPosition = (viewPort.width * group.label);
						if (group.labelOffset) labelPosition = (viewPort.width * group.label) - (viewPort.width * group.labelOffset);
						
						groupContainer.append("text")
					    	.text(groupLetters.length)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "end")
					    	.attr("transform", "translate(" + labelPosition + ", -10)");
					}
					else // displayOn: 'right'
					{
						var containerWidth = (viewPort.width * (1 - group.right)) - (viewPort.width * group.label);
						
						
						var groupContainer = chartArea.append("g")
							.attr("class", "letter-container " + group.name)
							.attr("transform", "translate(" + (viewPort.width * (1 - group.right) - containerWidth) + "," + viewPort.height * group.top + ")");
							
						var line = -1;
						var rectangleSize = viewPort.width * scope.RECTANGLE_RATIO;
						var baseX = containerWidth - rectangleSize;
						
						for (var i = 0; i < groupLetters.length; i++)
						{
							var letter = groupLetters[i];
						
							var groupSpacer = 0;
							if ((i+1) % 5 == 0) groupSpacer = scope.RECTANGLE_GROUP_SPACER;
							
							if (i % group.elem == 0)
							{
								line++;
								baseX = containerWidth - rectangleSize;
							}
							
							var xRectangle = baseX;
							baseX -= (rectangleSize + 1) + groupSpacer;
							var yRectangle = (line * (rectangleSize + 1));
							

							var composedClass = "";
			                for (var j = 0; j < letter.authors.length; j++) composedClass += " p" + letter.authors[j].id;
							
							groupContainer.append("rect")
			                    .attr("class", "letter l" + letter.id + " t" + letter.chapterId + composedClass + " y" + letter.accuratYear)
			                	.attr("person-id", letter.authors[0].id)
			                    .attr("letter-id", letter.id)
			                    .attr("letter-year", letter.accuratYear)
			                    .attr("letter-topic", letter.chapterId)
			                    .attr("width", rectangleSize)
			                    .attr("height", rectangleSize)
			                    .attr("y", yRectangle)
			                    .attr("x", xRectangle)
			                    .style("fill", ColorService.getChapterColor($routeParams.dataType, letter.chapterId))
			                    .on("click", function(d)
			                    {
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
				                    	}
			                    	}
			                    })
			                    .on("mouseout", function(d)
			                    {
									if (!PopupService.isPersistent())
									{
				                    	scope.$apply(function() {HighlightService.setLetterHoverId(null);});
										scope.$apply(function() {HighlightService.setPersonHoverId(null);});
									}
			                    });
						}
					
						
						groupContainer.append("line")
		        			.attr("class", "horizontal-line")
		        			.attr("x1", 0)
			                .attr("y1", 0)
			                .attr("x2", containerWidth)
			                .attr("y2", 0)
			                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
						
						groupContainer.append("text")
					    	.text(group.name)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "end")
					    	.attr("transform", "translate(" + containerWidth + ", -10)");
						
						var labelPosition = 0;
						if (group.labelOffset) labelPosition = (viewPort.width * group.labelOffset);
						
						groupContainer.append("text")
					    	.text(groupLetters.length)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "left")
					    	.attr("transform", "translate(" + labelPosition + ", -10)");
					}
				}
			};
		}
	};
}]);