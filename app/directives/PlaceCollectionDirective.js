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
			d3.selectAll(".menu-item").filter(".view").classed("active", false);
			d3.selectAll(".menu-item").filter(".view").filter(".view-where").classed("active", true);
			
			scope.HORIZONTAL_LINES_OFFSET_VERTICAL = -5;
			
			
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
	                		
	                		scope.$apply(function() {HighlightService.setLetterHoverId(null);});
	                		scope.$apply(function() {HighlightService.setPersonHoverId(null);});
	                	}
	                });
			    
			    var chartArea = svg.append("g")
		    		.attr("class", "chartArea")
		    		.attr("transform", "translate(" + CanvasService.getMargin().left + "," + (CanvasService.getMargin().top) + ")");
			    
			    var whereType = $routeParams.whereType;
			    if (whereType == SymbolsService.mapSnake) scope.drawMapSnake(chartArea, dataPlaceCollection);
			    else scope.drawMapContemporary(chartArea, dataPlaceCollection);
			    
			};
			
			scope.drawMapSnake = function(chartArea, dataPlaceCollection)
			{
				console.log(dataPlaceCollection);
				
				var m = MetricsService.getMetrics(SymbolsService.mapSnake);
				
				chartArea.append("image")
				    .attr("xlink:href","img/snake.svg")
				    .attr("width", CanvasService.getWidth() * m.snake.width)
				    .attr("height", (CanvasService.getWidth() * m.snake.width)/m.snake.ratio)
				    .attr("transform", "translate(" + CanvasService.getWidth() * m.snake.left + "," + CanvasService.getHeight() * m.snake.top + ")")
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
						.attr("transform", "translate(" + CanvasService.getWidth() * group.left + "," + CanvasService.getHeight() * group.top + ")");
					
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
						var rectangleSize = CanvasService.getWidth() * 0.003;
						
						var baseX = 0;
						
						for (var i = 0; i < groupLetters.length; i++)
						{
							var letter = groupLetters[i];
						
							if (i % group.elem == 0)
							{
								line++;
								baseX = 0;
							}
							
							var groupSpacer = 0;
							if (i % 5 == 0) groupSpacer = 2;
							
							//var x = ((i % group.elem) * (rectangleSize + 1)) + groupSpacer;
							var x = baseX + (rectangleSize + 1) + groupSpacer;
							baseX += (rectangleSize + 1) + groupSpacer;
							var y = (line * (rectangleSize + 1));
							

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
			                    .attr("y", y)
			                    .attr("x", x)
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
					
						if (group.displayName)
						{
							groupContainer.append("line")
			        			.attr("class", "horizontal-line")
			        			.attr("x1", 0)
				                .attr("y1", 0)
				                .attr("x2", group.elem * 7 + 10)
				                .attr("y2", 0)
				                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
							
							groupContainer.append("text")
						    	.text(group.name)
						    	.attr("class", "group-name")
						    	.attr("text-anchor", "left")
						    	.attr("transform", "translate(0, -10)");
						}
						else
						{
							groupContainer.append("line")
		        			.attr("class", "horizontal-line")
		        			.attr("x1", 0)
			                .attr("y1", 0)
			                .attr("x2", (CanvasService.getWidth() * group.labelLeft))
			                .attr("y2", 0)
			                .attr("transform", "translate(0," + scope.HORIZONTAL_LINES_OFFSET_VERTICAL + ")");
						
						groupContainer.append("text")
					    	.text(group.shortName)
					    	.attr("class", "group-name")
					    	.attr("text-anchor", "end")
					    	.attr("transform", "translate(" + (CanvasService.getWidth() * group.labelLeft) + ", -10)");
							
						}
					
					}
					
					
					
					
					
					
					
				}
				
				
				
				
			};
			
			scope.drawMapContemporary = function(dataPlaceCollection)
			{
				
			};
		}
	};
}]);