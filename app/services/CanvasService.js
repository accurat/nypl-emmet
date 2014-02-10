emmetApp.factory('CanvasService', ['TimeService', function(TimeService)
{
	var availableWidth;
	var availableHeight;
	
	var padding = 25;
	var margin = {top: 20, right: 20, bottom: 40, left: 80}; 
	
	var width = 0;
	var height = 0;
	
	var xScale = null;
	var yScale = null;
	
	var monthScale = null;
	var dayScale = null;
	var dayScale = null;
	
	return {
		
		init: function(desiredWidth, desiredHeight)
		{
			if (!desiredWidth || !desiredHeight)
			{
				if (typeof(window.innerWidth) == 'number')
				{
				    availableWidth = window.innerWidth;
				    availableHeight = window.innerHeight;
				}
				else
				{
					availableWidth = 1250;
					availableHeight = 900; 
				}
			}
			else
			{
				availableWidth = desiredWidth;
				availableHeight = desiredHeight;
			}
			
			width = availableWidth - margin.left - margin.right - padding;
			height = availableHeight - margin.top - margin.bottom - padding;
			
			xScale = d3.scale.ordinal()
		    	.rangeBands([0, width], .75)
		    	.domain(TimeService.getYears());

			yScale = d3.scale.linear()
		    	.range([0, height]);
			
			monthScale = d3.scale.ordinal()
	    		.rangeBands([0, width*2/3], 0)
	    		.domain(TimeService.getMonths());
			
			dayScale = d3.scale.ordinal()
				.rangeBands([0, width*2/3], 0)
	    		.domain(TimeService.getDays());
			
		},
		
		getWidth: function()
		{
			return width;
		},
		
		getHeight: function()
		{
			return height;
		},
		
		getAvailableWidth: function()
		{
			return availableWidth - padding;
		},
		
		getAvailableHeight: function()
		{
			return availableHeight - padding;
		},
		
		getMargin: function()
		{
			return margin;
		},
		
		getXoffset: function(value)
		{
			return xScale(value);
		},
		
		getYoffset: function(value)
		{
			return yScale(value);
		},
		
		getXscale: function()
		{
			return xScale;
		},
		
		getYscale: function()
		{
			return yScale;
		},
		
		getMonthScale: function()
		{
			return monthScale;
		},
		
		getDayScale: function()
		{
			return dayScale;
		}
	};
}]);