emmetApp.factory('TimeService', function()
{
	var timelineStart = null;
	var timelineEnd = null;
	var years = null;
	
	return {
		
		init: function(timelineStartYear, timelineEndYear)
		{
			timelineStart = timelineStartYear;
			timelineEnd = timelineEndYear;
			
			years = new Array();
			for (var year = timelineStart; year < timelineEnd; year++) years.push(year);
		},
		
		getYears: function()
		{
			return years;
		},
		
		isLetterInTimeline: function(letter)
		{
			if (!timelineStart) return false;
			if (!timelineEnd) return false;
			if (!letter) return false;
			if (!letter.accuratYear) return false;
			
			if (letter.accuratYear >= timelineStart && letter.accuratYear < timelineEnd) return true;
			else return false;
		},
		
		isYearInTimeline: function(year)
		{
			if (!timelineStart) return false;
			if (!timelineEnd) return false;
			if (!year) return false;
			
			if (year >= timelineStart && year < timelineEnd) return true;
			else return false;
		}
	};
});