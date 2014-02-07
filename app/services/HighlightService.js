emmetApp.factory('HighlightService', function()
{
	var letterHoverId = null;
	var personHoverId = null;
	var yearHoverId = null;
	var personYearHoverId = null;
	
	return {
		
		getData: function()
		{
			var highlight = {};
			highlight.letterId = letterHoverId;
			highlight.personId = personHoverId;
			highlight.yearId = yearHoverId;
			
			return highlight;
		},
		
		setLetterHoverId: function(letterId) {letterHoverId = letterId;},
		getLetterId: function() {return letterHoverId;},
		
		setPersonHoverId: function(personId) {personHoverId = personId;},
		getPersonId: function() {return personHoverId;},
		
		setYearHoverId: function(yearId) {yearHoverId = yearId;},
		getYearId: function() {return yearHoverId;},

	};
});