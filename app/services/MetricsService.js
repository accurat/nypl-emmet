emmetApp.factory('MetricsService', ['SymbolsService', function(SymbolsService)
{
	var s = {};
	
	s.snake = {ratio : 415/464, width : 0.33, top: 0.25, left: 0.30};
	
	s.groups = {};
	
	s.groups.ne = {id: 'ne', name: 'New England', shortName: 'N.E.', top: 0.40, left: 0.05, elem: 65, displayName: false, labelLeft: 0.50};
	s.groups.ny = {id: 'ny', name: 'New York', shortName: 'N.Y.', top: 0.48, left: 0.05, elem: 80, displayName: false, labelLeft: 0.46};
	s.groups.pa = {id: 'pa', name: 'Pennsylvania', shortName: 'Pa.', top: 0.55, left: 0.05, elem: 80, displayName: false, labelLeft: 0.40};
	s.groups.nj = {id: 'nj', name: 'New Jersey', shortName: 'N.J.', top: 0.61, left: 0.05, elem: 50, displayName: false, labelLeft: 0.47};
	s.groups.md = {id: 'md', name: 'Maryland', shortName: 'Md.', top: 0.69, left: 0.05, elem: 50, displayName: false, labelLeft: 0.40};
	s.groups.nh = {id: 'va', name: 'Virginia', shortName: 'Va.', top: 0.752, left: 0.05, elem: 60, displayName: false, labelLeft: 0.42};
	s.groups.sc = {id: 'sc', name: 'South Carolina', shortName: 'S.C.', top: 0.84, left: 0.05, elem: 65, displayName: false, labelLeft: 0.347};
	s.groups.nc = {id: 'nc', name: 'North Carolina', shortName: 'N.C.', top: 0.90, left: 0.05, elem: 60, displayName: false, labelLeft: 0.40};
	
	s.groups.us = {id: 'us', name: 'United States of America', top: 0.25, left: 0.14, elem: 60, displayName: true};
	
	s.groups.ca = {id: 'ca', name: 'Canada', top: 0.20, left: 0.05, elem: 10, displayName: true};	
	s.groups.uk = {id: 'uk', name: 'United Kingdom', top: 0.34, left: 0.68, elem: 10, displayName: true};
	s.groups.fr = {id: 'fr', name: 'France', top: 0.50, left: 0.73, elem: 10, displayName: true};		
	
	s.groups.other = {id: 'other', name: 'Other Places', top: 0.80, left: 0.60, elem: 10, displayName: true};		
	s.groups.unknown = { id: 'unknown', name: 'Unknown Places', top: 0.80, left: 0.70, elem: 15, displayName: true};
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