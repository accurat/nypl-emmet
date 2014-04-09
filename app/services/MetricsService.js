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
	c.usa = {ratio : 653/512, width : 0.48, top: 0.25, left: 0.00};
	c.groups = {};
	c.groups.ca = {id: 'ca', name: 'Canada', top: 0.20, left: 0.05, elem: 10, displayName: true};	
	c.groups.uk = {id: 'uk', name: 'United Kingdom', top: 0.34, left: 0.68, elem: 10, displayName: true};
	c.groups.fr = {id: 'fr', name: 'France', top: 0.50, left: 0.73, elem: 10, displayName: true};		
	c.groups.other = {id: 'other', name: 'Other Places', top: 0.80, left: 0.60, elem: 10, displayName: true};		
	c.groups.unknown = { id: 'unknown', name: 'Unknown Places', top: 0.80, left: 0.70, elem: 15, displayName: true};
	c.groups.undetermined = {id: 'undetermined', name: 'Undetermined Places', top: 0.80, left: 0.81, elem: 20, displayName: true};
	
	c.groups.ct = {id: 'ct', name: 'Connecticut', shortName: 'Ct.', top: 0.46, left: 0.44, displayName: false};
	c.groups.de = {id: 'de', name: 'Delaware', shortName: 'De.', top: 0.51, left: 0.42, displayName: false};
	c.groups.dc = {id: 'dc', name: 'District of Columbia', shortName: 'D.o.C.', top: 0.48, left: 0.05, displayName: false};
	c.groups.fl = {id: 'fl', name: 'Florida', shortName: 'Fl.', top: 0.80, left: 0.35, displayName: false};
	c.groups.ga = {id: 'ga', name: 'Georgia', shortName: 'Ga.', top: 0.70, left: 0.315, displayName: false};
	c.groups.ky = {id: 'ky', name: 'Kentucky', shortName: 'Ky.', top: 0.585, left: 0.29, displayName: false};
	c.groups.me = {id: 'me', name: 'Maine', shortName: 'Me.', top: 0.32, left: 0.44, displayName: false};
	c.groups.md = {id: 'md', name: 'Maryland', shortName: 'Md.', top: 0.54, left: 0.42, displayName: false};
	c.groups.ma = {id: 'ma', name: 'Massachusetts', shortName: 'Ma.', top: 0.42, left: 0.465, displayName: false};
	c.groups.nh = {id: 'nh', name: 'New Hampshire', shortName: 'N.H.', top: 0.385, left: 0.45, displayName: false};
	c.groups.nj = {id: 'nj', name: 'New Jersey', shortName: 'N.J.', top: 0.485, left: 0.425, displayName: false};
	c.groups.ny = {id: 'ny', name: 'New York', shortName: 'N.Y.', top: 0.42, left: 0.37, displayName: false};
	c.groups.nc = {id: 'nc', name: 'North Carolina', shortName: 'N.C.', top: 0.62, left: 0.35, displayName: false};
	c.groups.oh = {id: 'oh', name: 'Ohio', shortName: 'Oh.', top: 0.51, left: 0.31, displayName: false};
	c.groups.pa = {id: 'pa', name: 'Pennsylvania', shortName: 'Pa.', top: 0.48, left: 0.355, displayName: false};
	c.groups.ri = {id: 'ri', name: 'Rhode Island', shortName: 'R.I.', top: 0.44, left: 0.455, displayName: false};
	c.groups.sc = {id: 'sc', name: 'South Carolina', shortName: 'S.C.', top: 0.66, left: 0.34, displayName: false};
	c.groups.te = {id: 'tn', name: 'Tennessee', shortName: 'Tn.', top: 0.635, left: 0.27, displayName: false};
	c.groups.ve = {id: 've', name: 'Vermont', shortName: 'Ve.', top: 0.33, left: 0.395, displayName: false};
	c.groups.va = {id: 'va', name: 'Virginia', shortName: 'Va.', top: 0.57, left: 0.355, displayName: false};
	
	return {
		
		getMetrics: function(whereType)
		{
			if (whereType == SymbolsService.mapSnake) return s;
			else return c;
		}
	};
}]);