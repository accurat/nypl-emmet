emmetApp.factory('TimeService', function()
{
	var timelineStart = null;
	var timelineEnd = null;
	var years = null;
	var months = null;
	var days = null;
	
	return {
		
		init: function(timelineStartYear, timelineEndYear)
		{
			timelineStart = timelineStartYear;
			timelineEnd = timelineEndYear;
			
			years = new Array();
			for (var year = timelineStart; year < timelineEnd; year++) years.push(year);
			
			months = new Array();
			
			months.push("Jan");
			months.push("Feb");
			months.push("Mar");
			months.push("Apr");
			months.push("May");
			months.push("Jun");
			months.push("Jul");
			months.push("Aug");
			months.push("Sep");
			months.push("Oct");
			months.push("Nov");
			months.push("Dec");
			
			days = new Array();
			for (var day = 1; day <= 365; day++) days.push(day);
				
		},
		
		getDayOfYear: function(dateString)
		{
			var date = new Date(dateString);
			var start = new Date(date.getFullYear(), 0, 0);
			var diff = date - start;
			var oneDay = 1000 * 60 * 60 * 24;
			return Math.ceil(diff / oneDay);
			
		},
		
		getYears: function()
		{
			return years;
		},
		
		getMonths: function()
		{
			return months;
		},
		
		getDays: function()
		{
			return days;
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