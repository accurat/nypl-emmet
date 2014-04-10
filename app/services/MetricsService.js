emmetApp.factory('MetricsService', ['SymbolsService', function(SymbolsService)
{
	var s = {};
	s.snake = {ratio : 415/464, width : 0.40, top: 0.15, left: 0.30}; //0.33, 0.25
	s.groups = {};
	s.groups.ne = {id: 'ne', name: 'New England', shortName: 'N.E.', top: 0.35, left: 0.05, elem: 65, isColony: true, labelLeft: 0.51};
	s.groups.ny = {id: 'ny', name: 'New York', shortName: 'N.Y.', top: 0.425, left: 0.05, elem: 80, isColony: true, labelLeft: 0.50};
	s.groups.pa = {id: 'pa', name: 'Pennsylvania', shortName: 'Pa.', top: 0.50, left: 0.05, elem: 80, isColony: true, labelLeft: 0.42};
	s.groups.nj = {id: 'nj', name: 'New Jersey', shortName: 'N.J.', top: 0.58, left: 0.05, elem: 50, isColony: true, labelLeft: 0.52};
	s.groups.md = {id: 'md', name: 'Maryland', shortName: 'Md.', top: 0.69, left: 0.05, elem: 50, isColony: true, labelLeft: 0.42};
	s.groups.nh = {id: 'va', name: 'Virginia', shortName: 'Va.', top: 0.76, left: 0.05, elem: 60, isColony: true, labelLeft: 0.45};
	s.groups.sc = {id: 'sc', name: 'South Carolina', shortName: 'S.C.', top: 0.86, left: 0.05, elem: 65, isColony: true, labelLeft: 0.365};
	s.groups.nc = {id: 'nc', name: 'North Carolina', shortName: 'N.C.', top: 0.94, left: 0.05, elem: 60, isColony: true, labelLeft: 0.42};
	s.groups.us = {id: 'us', name: 'United States of America', top: 0.25, left: 0.05, elem: 40, isColony: false, displayName: true};
	s.groups.ca = {id: 'ca', name: 'Canada', top: 0.15, left: 0.05, elem: 10, isColony: false, displayName: true};	
	s.groups.uk = {id: 'uk', name: 'United Kingdom', top: 0.34, left: 0.81, elem: 10, isColony: false, displayName: true};
	s.groups.fr = {id: 'fr', name: 'France', top: 0.50, left: 0.81, elem: 10, isColony: false, displayName: true};		
	s.groups.other = {id: 'other', name: 'Other Places', top: 0.80, left: 0.60, elem: 10, isColony: false, displayName: true};		
	s.groups.unknown = { id: 'unknown', name: 'Unknown Places', top: 0.80, left: 0.70, elem: 15, isColony: false, displayName: true};
	s.groups.undetermined = {id: 'undetermined', name: 'Undetermined Places', top: 0.80, left: 0.81, isColony: false, elem: 20, displayName: true};
	
	var c = {};
	c.usa = {ratio : 333/512, width : 0.31, top: 0.10, left: 0.30}; //653/512
	c.groups = {};
	//c.groups.ca = {id: 'ca', name: 'Canada', top: 0.20, left: 0.05, elem: 10, displayName: true};	
	//c.groups.uk = {id: 'uk', name: 'United Kingdom', top: 0.34, left: 0.81, elem: 10, displayName: true};
	//c.groups.fr = {id: 'fr', name: 'France', top: 0.50, left: 0.81, elem: 10, displayName: true};		
	//c.groups.other = {id: 'other', name: 'Other Places', top: 0.80, left: 0.60, elem: 10, displayName: true};		
	//c.groups.unknown = { id: 'unknown', name: 'Unknown Places', top: 0.80, left: 0.70, elem: 15, displayName: true};
	//c.groups.undetermined = {id: 'undetermined', name: 'Undetermined Places', top: 0.80, left: 0.81, elem: 20, displayName: true};
	
	// left states
	c.groups.ny = {id: 'ny', name: 'New York', 				shortName: 'N.Y.', 	top: 0.250, left: 0.05, elem: 95, label: 0.465, labelOffset: 0.035, displayOn: 'left'};
	c.groups.ri = {id: 'ri', name: 'Rhode Island', 			shortName: 'R.I.', 	top: 0.315, left: 0.05, elem: 65, label: 0.505, labelOffset: 0.115, displayOn: 'left'};
	c.groups.pa = {id: 'pa', name: 'Pennsylvania', 			shortName: 'Pa.', 	top: 0.350, left: 0.05, elem: 75, label: 0.440, labelOffset: 0.055, displayOn: 'left'};
	c.groups.dc = {id: 'dc', name: 'District of Columbia', 	shortName: 'D.C.', 	top: 0.430, left: 0.05, elem: 75, label: 0.445, labelOffset: 0.000, displayOn: 'left'};
	c.groups.oh = {id: 'oh', name: 'Ohio', 					shortName: 'Oh.', 	top: 0.470, left: 0.05, elem: 75, label: 0.350, labelOffset: 0.000, displayOn: 'left'};
	c.groups.ky = {id: 'ky', name: 'Kentucky', 				shortName: 'Ky.', 	top: 0.520, left: 0.05, elem: 75, label: 0.340, labelOffset: 0.000, displayOn: 'left'};	
	c.groups.te = {id: 'tn', name: 'Tennessee', 			shortName: 'Tn.', 	top: 0.590, left: 0.05, elem: 75, label: 0.300, labelOffset: 0.000, displayOn: 'left'};
	
	// right states
	c.groups.me = {id: 'me', name: 'Maine', 			shortName: 'Me.', 	top: 0.200, right: 0.05, elem: 80, label: 0.570, labelOffset: 0.000, displayOn: 'right'};
	c.groups.ve = {id: 've', name: 'Vermont', 			shortName: 'Ve.', 	top: 0.240, right: 0.05, elem: 80, label: 0.530, labelOffset: 0.000, displayOn: 'right'};
	c.groups.nh = {id: 'nh', name: 'New Hampshire', 	shortName: 'N.H.', 	top: 0.275, right: 0.05, elem: 80, label: 0.555, labelOffset: 0.030, displayOn: 'right'};
	c.groups.ma = {id: 'ma', name: 'Massachusetts', 	shortName: 'Ma.', 	top: 0.310, right: 0.05, elem: 65, label: 0.540, labelOffset: 0.000, displayOn: 'right'};
	c.groups.ct = {id: 'ct', name: 'Connecticut', 		shortName: 'Ct.', 	top: 0.355, right: 0.05, elem: 80, label: 0.535, labelOffset: 0.025, displayOn: 'right'};
	c.groups.nj = {id: 'nj', name: 'New Jersey', 		shortName: 'N.J.', 	top: 0.395, right: 0.05, elem: 80, label: 0.525, labelOffset: 0.010, displayOn: 'right'};
	c.groups.de = {id: 'de', name: 'Delaware', 			shortName: 'De.', 	top: 0.435, right: 0.05, elem: 80, label: 0.520, labelOffset: 0.010, displayOn: 'right'};
	c.groups.md = {id: 'md', name: 'Maryland', 			shortName: 'Md.', 	top: 0.475, right: 0.05, elem: 80, label: 0.510, labelOffset: 0.015, displayOn: 'right'};
	c.groups.va = {id: 'va', name: 'Virginia', 			shortName: 'Va.', 	top: 0.520, right: 0.05, elem: 80, label: 0.460, labelOffset: 0.000, displayOn: 'right'};
	c.groups.nc = {id: 'nc', name: 'North Carolina', 	shortName: 'N.C.', 	top: 0.580, right: 0.05, elem: 80, label: 0.480, labelOffset: 0.000, displayOn: 'right'};
	c.groups.sc = {id: 'sc', name: 'South Carolina', 	shortName: 'S.C.', 	top: 0.640, right: 0.05, elem: 90, label: 0.460, labelOffset: 0.000, displayOn: 'right'};
	c.groups.ga = {id: 'ga', name: 'Georgia', 			shortName: 'Ga.', 	top: 0.720, right: 0.05, elem: 80, label: 0.420, labelOffset: 0.000, displayOn: 'right'};
	c.groups.fl = {id: 'fl', name: 'Florida', 			shortName: 'Fl.', 	top: 0.800, right: 0.05, elem: 80, label: 0.450, labelOffset: 0.000, displayOn: 'right'};
	
	return {
		
		getMetrics: function(whereType)
		{
			if (whereType == SymbolsService.mapSnake) return s;
			else return c;
		}
	};
}]);