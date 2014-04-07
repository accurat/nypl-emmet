var emmetApp = angular
	.module('emmet',['ngRoute'])
	.config(function($routeProvider) 
	{
		$routeProvider
			.when('/', {redirectTo:'/data/accurat/view/when/order/byAuthorYear'})
			.when('/data/:dataType/view/:viewType/order/:orderType',
			{
				controller: 'WhenController',
				templateUrl: 'app/templates/When.tpl.html'
			})
			.when('/data/:dataType/view/:viewType/person/:personId',
			{
				controller: 'WhoController',
				templateUrl: 'app/templates/Who.tpl.html'
			})
			.when('/data/:dataType/view/:viewType/map/:whereType',
			{
				controller: 'WhereController',
				templateUrl: 'app/templates/Where.tpl.html'
			})
			.otherwise({redirectTo:'/'});
	});
