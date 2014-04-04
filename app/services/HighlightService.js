emmetApp.factory('HighlightService', function()
{
	var highlightIsPersistent = false;
	
	var letterHoverId = null;
	var personHoverId = null;
	var yearHoverId = null;
	var topicHoverId = null;
	
	
	return {
		
		setPersistent: function(isPersistent) {highlightIsPersistent = isPersistent;},
		isPersistent: function() {return highlightIsPersistent;},
		
		setLetterHoverId: function(letterId) {letterHoverId = letterId;},
		getLetterId: function() {return letterHoverId;},
		
		setPersonHoverId: function(personId) {personHoverId = personId;},
		getPersonId: function() {return personHoverId;},
		
		setYearHoverId: function(yearId) {yearHoverId = yearId;},
		getYearId: function() {return yearHoverId;},
		
		setTopicHoverId: function(topicId) {topicHoverId = topicId;},
		getTopicId: function() {return topicHoverId;},
		
		reset: function() {
			letterHoverId = null;
			personHoverId = null;
			yearHoverId = null;
			topicHoverId = null;
			
			highlightIsPersistent = false;
		}

	};
});