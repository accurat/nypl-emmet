emmetApp.factory('CanvasService', function()
{
	var availableWidth;
	var availableHeight;
	
	var margin = {top: 5, right: 20, bottom: 5, left: 40}; 
	
	var width = 0;
	var height = 0;
	
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
			
			width = availableWidth - margin.left - margin.right;
			height = availableHeight - margin.top - margin.bottom;
		},
		
		initOnContainer: function(elementSelector) {
			if (!elementSelector) return;
			
			var parentContainer = document.getElementById(elementSelector);
			
			availableWidth = parentContainer.offsetWidth;
			availableHeight = window.innerHeight;
			
			width = availableWidth - margin.left - margin.right;
			height = availableHeight - margin.top - margin.bottom;
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
			return availableWidth;
		},
		
		getAvailableHeight: function()
		{
			return availableHeight;
		},
		
		getMargin: function()
		{
			return margin;
		}
	};
});