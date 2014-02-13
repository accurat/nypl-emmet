emmetApp.factory('HighlightService', function()
{
	var letterHoverId = null;
	var personHoverId = null;
	var yearHoverId = null;
	var topicHoverId = null;
	
	
	return {
		
		getData: function()
		{
			var highlight = {};
			highlight.letterId = letterHoverId;
			highlight.personId = personHoverId;
			highlight.yearId = yearHoverId;
			highlight.topicId = topicHoverId;
			
			return highlight;
		},
		
		setLetterHoverId: function(letterId) {letterHoverId = letterId;},
		getLetterId: function() {return letterHoverId;},
		
		setPersonHoverId: function(personId) {personHoverId = personId;},
		getPersonId: function() {return personHoverId;},
		
		setYearHoverId: function(yearId) {yearHoverId = yearId;},
		getYearId: function() {return yearHoverId;},
		
		setTopicHoverId: function(topicId) {topicHoverId = topicId;},
		getTopicId: function() {return topicHoverId;}

	};
});