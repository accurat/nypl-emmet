emmetApp.factory('MetricsService', ['SymbolsService', function(SymbolsService)
{
	var s = {};
	
	s.snake = {ratio : 415/464, width : 0.33, top: 0.25, left: 0.30};
	
	s.groups = {};
	
	s.groups.ne = {id: 'ne', name: 'New England', top: 0.35, left: 0.05, elem: 65, displayName: false};
	s.groups.ny = {id: 'ny', name: 'New York', top: 0.43, left: 0.05, elem: 65, displayName: false};
	s.groups.pa = {id: 'pa', name: 'Pennsylvania', top: 0.50, left: 0.05, elem: 70, displayName: false};
	s.groups.nj = {id: 'nj', name: 'New Jersey', top: 0.58, left: 0.05, elem: 50, displayName: false};
	s.groups.md = {id: 'md', name: 'Maryland', top: 0.65, left: 0.05, elem: 50, displayName: false};
	s.groups.nh = {id: 'va', name: 'Virginia', top: 0.73, left: 0.05, elem: 60, displayName: false};
	s.groups.sc = {id: 'sc', name: 'South Carolina', top: 0.80, left: 0.05, elem: 65, displayName: false};
	s.groups.nc = {id: 'nc', name: 'North Carolina', top: 0.88, left: 0.05, elem: 60, displayName: false};
	
	s.groups.us = {id: 'us', name: 'United States of America', top: 0.25, left: 0.14, elem: 60, displayName: true};
	
	s.groups.ca = {id: 'ca', name: 'Canada', top: 0.20, left: 0.05, elem: 10, displayName: true};	
	s.groups.uk = {id: 'uk', name: 'United Kingdom', top: 0.34, left: 0.68, elem: 10, displayName: true};
	s.groups.fr = {id: 'fr', name: 'France', top: 0.50, left: 0.73, elem: 10, displayName: true};		
	
	s.groups.other = {id: 'other', name: 'Other Places', top: 0.80, left: 0.53, elem: 10, displayName: true};		
	s.groups.unknown = { id: 'unknown', name: 'Unknown Places', top: 0.80, left: 0.67, elem: 15, displayName: true};
	s.groups.undetermined = {id: 'undetermined', name: 'Undetermined Places', top: 0.80, left: 0.81, elem: 20, displayName: true};
	
	var c = {};
	
	
	return {
		
		getMetrics: function(whereType)
		{
			if (whereType == SymbolsService.mapSnake) return s;
			else return c;
		}
	};
}]);