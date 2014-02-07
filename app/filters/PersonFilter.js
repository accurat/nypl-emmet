emmetApp.filter('personFilter', [function () 
{
	return function (people, filterExpression) 
	{
		if (!angular.isUndefined(people) && !angular.isUndefined(filterExpression) && filterExpression.length > 0) 
		{
			var tmpPeople = new Array();
            for (var i = 0; i < people.length; i++)
            {
            	var person = people[i];
            	if (person.name.toLowerCase().indexOf(filterExpression.toLowerCase()) != -1) tmpPeople.push(person);
            }
			return tmpPeople;
        } 
		else return new Array();
    };
}]);