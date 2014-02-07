emmetApp.factory('ColorService', ['SymbolsService', function(SymbolsService)
{
	var colorByAccuratName = null;
	var colorByAccuratId = null;
	var colorByEmmetId = null;
	
	var COLOR_DEFAULT = "#000000";
	var COLOR_PAGE_BACKGROUND = "#F5EEDF";
	
	
	return {
		
		init: function()
		{
			colorByAccuratName = d3.scale.ordinal()
		    	.domain(["Congresses, Members and Presidents", "The Declaration of Independence and the Signers", "Lossing's Field Book of Revolution","Wars and battles","The Generals","Washington","Bureaucracy","others"])
		        .range(["#B49B2E", "#0C0E0C", "#39312D", "#5D1418", "#1D294E", "#4D608F", "#917654", "#9B7C78"]);
			
			colorByAccuratId = d3.scale.ordinal()
	    		.domain(["1", "2", "3", "4", "5", "6", "7", "8"])
	    		.range(["#B49B2E", "#0C0E0C", "#39312D", "#5D1418", "#1D294E", "#4D608F", "#917654", "#9B7C78"]);
			
			colorByEmmetId = d3.scale.ordinal()
	    		.domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"])
	    		.range([this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor()]);
		},
		
		getRandomColor: function() 
		{
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) color += letters[Math.round(Math.random() * 15)]; 
		    return color;
		},
		
		getColorFor: function(element)
		{
			if (!element) return DEFAULT_COLOR;
			else if (element = "pageBackground") return COLOR_PAGE_BACKGROUND;
			
		},
		
		getChapterColor: function(dataType, chapterId)
		{
			if (dataType == SymbolsService.dataAccurat)
			{
				return colorByAccuratId(chapterId);
			}
			else
			{
				return colorByEmmetId(chapterId);
			}
			
		}
	};
}]);